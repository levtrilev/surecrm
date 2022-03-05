import { useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { currentOrderIdState, newOrderDefault, newOrderState, ordersFullQuery } from './data/orderState'
import { openEditModalState, showYesCancelDialogState } from '../../state/state'
import { currentCustomerIdState } from '../customer/data/customerState';

export function useEditOrderAction(id: number) {

    const orders = useRecoilValue(ordersFullQuery) as OrderFullType[];
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState);
    const setNewOrder = useSetRecoilState(newOrderState);
    const setCurrentOrderCustomerId = useSetRecoilState(currentCustomerIdState);
    const setOpenEditModal = useSetRecoilState(openEditModalState);

    const fullOrderToOrder = (order: OrderFullType) => {
        // removes customers
        // to transform orderFullType to orderType
        let { customers, ...newOrder } = order;
        return (newOrder);
    };

        if (id === 0) {
            setNewOrder(newOrderDefault);
            setCurrentOrderId(0);
            setCurrentOrderCustomerId(0);
        } else {
            setCurrentOrderId(id);
            const order = orders.find(x => x.id === id) as OrderFullType;
            setNewOrder(fullOrderToOrder(order));
            setCurrentOrderCustomerId(order.customer_id);
        }
        setOpenEditModal(true);
}

export function useCopyOrderAction(id: number) {

    const orders = useRecoilValue(ordersFullQuery) as OrderFullType[];
    const setNewOrder = useSetRecoilState(newOrderState);
    const setCurrentOrderCustomerId = useSetRecoilState(currentCustomerIdState);
    const setOpenEditModal = useSetRecoilState(openEditModalState);

    const fullOrderToOrder = (order: OrderFullType) => {
        // removes customers
        // to transform orderFullType to orderType
        let { customers, ...newOrder } = order;
        return (newOrder);
    };

        const order = orders.find(x => x.id === id) as OrderFullType;
        setNewOrder({ ...(fullOrderToOrder(order)), 'id': 0 });
        setCurrentOrderCustomerId(order.customer_id);
        setOpenEditModal(true);
}

export function useDeleteOrderAction(id: number) {

    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const setShowYesCancelDialog = useSetRecoilState(showYesCancelDialogState);
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState);

        setShowYesCancelDialog(true);
        setCurrentOrderId(id);
        setTimeout(refreshOrders, 300);
}