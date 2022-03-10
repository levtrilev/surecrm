import * as React from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newOrderState, orderQuery, ordersFullQuery } from './data/orderState';
import { postNewOrder, putUpdatedOrder } from './data/orderDao';
import { currentCustomerIdState } from '../customer/data/customerState';
import { useEffect, useRef } from 'react';
import { OrderEditForm } from './OrderEditForm';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';

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

    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const refreshOrder = useRecoilRefresher_UNSTABLE(orderQuery(outerEditContext));

    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    // const setOpenCustomerSelector = useSetRecoilState(openCustomerSelectorState);
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

    const updateOrder = () => {
        if (newOrder.id === 0) {
            postNewOrder(newOrder);
        } else {
            putUpdatedOrder(newOrder);
        }
        setIsModified(false);
        setTimeout(refreshOrders, 300);
        setTimeout(refreshOrder, 300);
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
            setYesNoCancel('neutral');
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setYesNoCancel('neutral');
            setFromParrent(false);
        } else {
            setYesNoCancel('neutral');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <OrderEditForm
                order={order}
                updateOrder={updateOrder}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
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