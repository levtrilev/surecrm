import * as React from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newOrderState, ordersFullQuery } from './data/orderState';
import { postNewOrder, putUpdatedOrder } from './data/orderDao';
import CustomerSelector from '../customer/CustomerSelecorBak';
import { currentCustomerIdState, openCustomerSelectorState } from '../customer/data/customerState';
import { useEffect } from 'react';
import { OrderEditForm } from './OrderEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    order: OrderType;
    editmodeText: string;
}

export const OrderEdit: React.FC<Props> = ({ order, modalState, setFromParrent, editmodeText }) => {
    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const setOpenCustomerSelector = useSetRecoilState(openCustomerSelectorState);
    const currentCustomerId = useRecoilValue(currentCustomerIdState);

    const handleClose = () => {
        setFromParrent(false);
    };

    const updateOrder = (order: OrderType) => {
        if (order.id === 0) {
            postNewOrder({ ...order, 'name': order.number });
        } else {
            putUpdatedOrder({ ...order, 'name': order.number });
        }
        setTimeout(refreshOrders, 300);
    };

    useEffect(() => {
        setNewOrder({ ...newOrder, 'customer_id': currentCustomerId });
        console.log('useEffect fired!');
    }, [currentCustomerId]);

    return (
        <div>
        <OrderEditForm
            order={order}
            updateOrder={updateOrder}
            setOpenCustomerSelector={setOpenCustomerSelector}
            CustomerSelector={CustomerSelector}
            handleClose={handleClose}
            modalState={modalState}
            editmodeText={editmodeText}
        />
    </div>
    );
}

export default OrderEdit;