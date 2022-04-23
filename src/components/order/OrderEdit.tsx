import * as React from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentOrderIdState, newOrderState, orderProductsFullQuery, orderQuery, ordersFullQuery } from './data/orderState';
import { deleteOrderProducts, postNewOrder, postOrderProducts, putUpdatedOrder } from './data/orderDao';
import { currentCustomerIdState } from '../customer/data/customerState';
import { useEffect, useRef } from 'react';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { OrderFormDialog } from './OrderFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    order: OrderType;
    editmodeText: string;
    outerEditContext: string;
}

export const OrderEdit: React.FC<Props> = ({ order, modalState,
    setFromParrent, editmodeText, outerEditContext }) => {
    const localEditContext = 'Order.' + order.id;
    const isInitialMount = useRef(true);

    const orderProducts = useRecoilValue(orderProductsFullQuery(outerEditContext)) as OrderProductsFullType[];
    const orderProductsEditRef = useRef([...orderProducts]);
    // const setOrderProductsLines = useSetRecoilState(orderProductsLinesState(outerEditContext));
    // setOrderProductsLines([...orderProducts]);
    
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState(outerEditContext));

    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const refreshOrder = useRecoilRefresher_UNSTABLE(orderQuery(outerEditContext));
    const refreshOrderProducts = useRecoilRefresher_UNSTABLE(orderProductsFullQuery(outerEditContext));

    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const currentCustomerId = useRecoilValue(currentCustomerIdState(outerEditContext));

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));

    const handleClose = () => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateOrder = async () => {
        if (newOrder.id === 0) {
            let newOrderId = await postNewOrder(newOrder);
            setCurrentOrderId(newOrderId);
            // debugger;
            if (orderProductsEditRef.current.length > 0) {
                const tmp = orderProductsEditRef.current as OrderProductsFullType[];
                orderProductsEditRef.current = tmp.map((el) => { return { ...el, order_id: newOrderId }; });
                // debugger;
                // setOrderProductsLines(orderProductsEditRef.current);
                postOrderProducts(orderProductsEditRef.current);
            }
        } else {
            await putUpdatedOrder(newOrder);
            await deleteOrderProducts(newOrder.id);
            await postOrderProducts(orderProductsEditRef.current);
        }
        setIsModified(false);
        setTimeout(refreshOrders, 300);
        setTimeout(refreshOrder, 300);
        setTimeout(refreshOrderProducts, 300);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setNewOrder({ ...newOrder, 'customer_id': currentCustomerId });
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCustomerId]);

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateOrder();
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setFromParrent(false);
        }
        setYesNoCancel('neutral');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <OrderFormDialog
                order={order}
                updateOrder={updateOrder}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
                orderProductsEditRef={orderProductsEditRef}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${order.id}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default OrderEdit;

function orderProductsFullQueryEdit(outerEditContext: string): import("recoil").RecoilState<unknown> {
    throw new Error('Function not implemented.');
}
