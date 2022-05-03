import * as React from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { currentOrderIdState, isModifiedOrderProductsState, newOrderState, orderProductsFullQuery, orderQuery, ordersFullQuery } from './data/orderState';
import { deleteOrderProducts, postNewOrder, postOrderProducts, putUpdatedOrder } from './data/orderDao';
import { currentCustomerIdState } from '../customer/data/customerState';
import { useEffect, useRef } from 'react';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { OrderFormDialog } from './OrderFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const OrderEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }): JSX.Element => {
    const [currentOrderId, setCurrentOrderId] = useRecoilState(currentOrderIdState(outerEditContext));
    const localEditContext = 'Order.' + currentOrderId;
    const isInitialMount = useRef(true);

    const orderProducts = useRecoilValue(orderProductsFullQuery(outerEditContext)) as OrderProductsFullType[];
    const orderProductsEditRef = useRef([...orderProducts]);
    const isModifiedOrderProducts = useRecoilValue(isModifiedOrderProductsState(outerEditContext));

    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const refreshOrder = useRecoilRefresher_UNSTABLE(orderQuery(outerEditContext));
    const refreshOrderProducts = useRecoilRefresher_UNSTABLE(orderProductsFullQuery(outerEditContext));

    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const currentCustomerId = useRecoilValue(currentCustomerIdState(outerEditContext));

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));

    const handleClose = (): void => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateOrder = async (): Promise<void> => {
        if (newOrder.id === 0) {
            let newOrderId = await postNewOrder(newOrder);
            setCurrentOrderId(newOrderId);
            setNewOrder({ ...newOrder, id: newOrderId });
            
            if (isModifiedOrderProducts &&
                orderProductsEditRef.current.length > 0) {
                const tmp = orderProductsEditRef.current as OrderProductsFullType[];
                orderProductsEditRef.current = tmp.map((el) => { return { ...el, order_id: newOrderId }; });
                postOrderProducts(orderProductsEditRef.current);
            }
        } else {
            await putUpdatedOrder(newOrder);
            if (isModifiedOrderProducts) {
                await deleteOrderProducts(newOrder.id);
                await postOrderProducts(orderProductsEditRef.current);
            }
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
                updateOrder={updateOrder}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
                orderProductsEditRef={orderProductsEditRef}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentOrderId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default OrderEdit;
