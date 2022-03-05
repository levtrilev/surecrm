import * as React from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newOrderState, orderQuery, ordersFullQuery } from './data/orderState';
import { postNewOrder, putUpdatedOrder } from './data/orderDao';
import { currentCustomerIdState, openCustomerSelectorState } from '../customer/data/customerState';
import { useEffect } from 'react';
import { OrderEditForm } from './OrderEditForm';
import { CustomerSelector } from '../customer/CustomerSelector';

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
    const refreshOrder = useRecoilRefresher_UNSTABLE(orderQuery);

    const handleClose = () => {
        setFromParrent(false);
    };

    const updateOrder = (order: OrderType) => {
        if (order.id === 0) {
            postNewOrder(order);
        } else {
            putUpdatedOrder(order);
        }
        setTimeout(refreshOrders, 300);
        setTimeout(refreshOrder, 300);
    };

    useEffect(() => {
        setNewOrder({ ...newOrder, 'customer_id': currentCustomerId });
        // console.log('useEffect fired!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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