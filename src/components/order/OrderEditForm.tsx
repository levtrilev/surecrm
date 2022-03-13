import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import Button from '@mui/material/Button';
import { newOrderState } from './data/orderState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { customerQuery, openCustomerSelectorState } from '../customer/data/customerState';
import { CustomerSelector } from '../customer/CustomerSelector';
import { isModifiedState } from '../../state/state';

const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

interface Props {
    order: OrderType;
    updateOrder: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const OrderEditForm: React.FC<Props> = ({ order, updateOrder,
    handleClose, modalState, editmodeText, editContext }) => {
    const localEditContext = 'Order.' + order.id

    const currentCustomer = useRecoilValue(customerQuery(editContext));
    const refreshCustomer = useRecoilRefresher_UNSTABLE(customerQuery(editContext));

    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openCustomerSelector, setOpenCustomerSelector] = useRecoilState(openCustomerSelectorState);

    const onOrderNumberChange = (event: any) => {
        setNewOrder({ ...newOrder, 'number': event.target.value, 'name': event.target.value });
        setIsModified(true);
    };

    return (
        <React.Fragment>
            <Modal
                open={modalState}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 600 }}>
                    <Grid container spacing={1}>
                        <Grid container item spacing={3}>
                            <Grid item xs={11}>
                                <Item>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {`Order id: ${order.id} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box mt={2}></Box>
                    <Grid container spacing={1}>
                        <Grid container item spacing={3}>
                            <Grid item xs={4}>
                                <TextField id="order-number" label="Order number" onChange={onOrderNumberChange} value={newOrder.number} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField id="order-customer-id" label="Customer ID (select)"
                                    onClick={() => { setOpenCustomerSelector(true); refreshCustomer(); }}
                                    value={newOrder.customer_id} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField id="customer" label="Customer"
                                    onClick={() => { setOpenCustomerSelector(true); refreshCustomer(); }}
                                    value={currentCustomer.name} />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={3}>
                            <Grid item xs={4}>
                                <Button onClick={updateOrder}>
                                    save
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button onClick={handleClose}>
                                    Exit
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                {/* <Button onClick={goToEditDoc}>
                                    Go tab
                                </Button> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    {openCustomerSelector ? <CustomerSelector editContext={editContext} enableDruggableParent={()=>{}}/> : <></>}
                </Box>
            </Modal>
        </React.Fragment>
    );
}