import React, { useEffect } from 'react'
import {
    useRecoilState,
    useRecoilValue,
    useRecoilRefresher_UNSTABLE,
} from 'recoil';
import { currentOrderIdState, orderQuery, ordersFullQuery } from './data/orderState'
import { Box, Container, Grid } from '@mui/material';
import { deleteOrder } from './data/orderDao';
import Order from './Order';
import YesCancelDialog from '../../shared/YesCancelDialog';
import OrderEdit from './OrderEdit';
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state';
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';
// import {useEditOrderAction } from './useOrderActions';

const Orders: React.FC = () => {

    // const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const orders = useRecoilValue(ordersFullQuery) as OrderFullType[];
    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const orderToOpen = useRecoilValue(orderQuery);
    const currentOrderId = useRecoilValue(currentOrderIdState);

    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState);
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState);

    // const editOrderAction = useEditOrderAction;

    useEffect(() => {
        if (yesCancel) {
            deleteOrder(currentOrderId);
            setTimeout(refreshOrders, 300);
            setYesCancel(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOrderId, yesCancel]);

    return (
        <div style={{ margin: 80 }}>
            <TopDocsButtons
                id={0}
                refreshAction={refreshOrders}
                deleteAction={() => { }}
                createNewAction={() => {}}
                copyAction={() => { }}
            />
            <Box height={2}></Box>
            <div className="blog-content layout">
                <Grid container spacing={0} border={0.5}>
                    <Grid item xs={1}>
                        <Container>id</Container>
                    </Grid>
                    <Grid item xs={7}>
                        <Container>Order</Container>
                    </Grid>
                    <Grid item xs={1}>
                        <Container>Cusotmr</Container>
                    </Grid>
                    <Grid item xs={1}>
                        <Container>Deleted</Container>
                    </Grid>
                    <Grid item xs={2}>
                        <Container style={{ paddingLeft: 32, paddingRight: 4, alignItems: 'center', justifyContent: 'center' }}>Actions</Container>
                    </Grid>
                </Grid>
                {orders.length ? orders.map(order => <Order key={order.id} order={order} />) : <tr>"Нет записей"</tr>}
            </div>
            {openEditModal ? <OrderEdit
                order={orderToOpen}
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText={'edit mode'}
            /> : <></>}
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete Order (id = ${orderToOpen.id}) ?`} modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} /> : <></>}
        </div>
    )
}

export default Orders
