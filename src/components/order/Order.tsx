import { ButtonGroup, Container, Divider, Grid, IconButton } from '@mui/material';
import React from 'react'
import { useSetRecoilState } from 'recoil';
import { currentOrderIdState, newOrderState } from './data/orderState';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { openEditModalState, showYesCancelDialogState } from '../../state/state';
import { currentCustomerIdState } from '../customer/data/customerState';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import {useDeleteOrderAction } from './useOrderActions';

interface Props {
    order: OrderFullType;
}

export const Order: React.FC<Props> = ({ order }) => {
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState);
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState)
    const setOpenEditModal = useSetRecoilState(openEditModalState);
    const setShowYesCancelDialog = useSetRecoilState(showYesCancelDialogState);
    const setNewOrder = useSetRecoilState(newOrderState);

    // const editOrderAction = useEditOrderAction;
    // const deleteOrderAction = useDeleteOrderAction;
    // const _deleteOrderAction = (id: number) => deleteOrderAction(id);
    // const copyOrderAction = useCopyOrderAction;

    const fullOrderToOrder = (order: OrderFullType) => {
        // removes customers
        // to transform orderFullType to orderType
        let { customers, ...newOrder } = order;
        return (newOrder);
    };

    return (
        <>
            <Grid container spacing={0} >
                <Grid item xs={1}>
                    <Container>{order.id}</Container>
                </Grid>
                <Grid item xs={7}>
                    <Container>{order.number}</Container>
                </Grid>
                <Grid item xs={1}>
                    <Container>{order.customer_id}</Container>
                </Grid>
                <Grid item xs={1}>
                    <Container>{order.deleted ? 'v' : ' '}</Container>
                </Grid>
                <Grid item xs={2} >
                    <Container >
                        <ButtonGroup>
                        {/* <IconButton size="medium" onClick={() => {
                                 deleteOrderAction(order.id);
                             }}>
                                 <DeleteIcon />
                             </IconButton> */}
                             <IconButton size="medium" onClick={() => {
                                 setShowYesCancelDialog(true);
                                 setCurrentOrderId(order.id);
                             }}>
                                 <DeleteIcon />
                             </IconButton>
                            <IconButton size="medium" onClick={() => {
                                setCurrentOrderId(order.id);
                                setCurrentCustomerId(order.customer_id);
                                setNewOrder(fullOrderToOrder(order));
                                setOpenEditModal(true);
                            }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="medium" onClick={() => {
                                // copyOrderAction(order.id);
                            }}>
                                <ContentCopyIcon />
                            </IconButton>
                        </ButtonGroup>
                    </Container>
                </Grid>
            </Grid>
            <Divider />
        </>
    )
}

export default React.memo(Order)

