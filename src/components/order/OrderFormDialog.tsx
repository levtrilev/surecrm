import * as React from 'react';
import Box from '@mui/material/Box';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import Button from '@mui/material/Button';
import { newOrderState } from './data/orderState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { customerQuery, openCustomerSelectorState } from '../customer/data/customerState';
import { CustomerSelector } from '../customer/CustomerSelector';
import { isModifiedState } from '../../state/state';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';
import { useRef } from 'react';

interface Props {
    order: OrderType;
    updateOrder: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const OrderFormDialog: React.FC<Props> = ({ order, updateOrder,
    handleClose, modalState, editmodeText, editContext }) => {
    const localEditContext = 'Order.' + order.id
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentCustomer = useRecoilValue(customerQuery(editContext));
    const refreshCustomer = useRecoilRefresher_UNSTABLE(customerQuery(editContext));

    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openCustomerSelector, setOpenCustomerSelector] = useRecoilState(openCustomerSelectorState);

    const onOrderNumberChange = (event: any) => {
        setNewOrder({ ...newOrder, 'number': event.target.value, 'name': event.target.value });
        setIsModified(true);
    };
    const enableDruggableParent = () => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    const clickOpenCustomerSelector = () => {
        setOpenCustomerSelector(true);
        refreshCustomer();
        paperComponentRef.current = paperComponentDisabledRef.current;
    };
    return (
        <Dialog
            open={modalState}
            onClose={handleClose}
            PaperComponent={paperComponentRef.current}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogContent>
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
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
                </DialogTitle>
                <Box mt={2}></Box>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="order-number" label="Order number" onChange={onOrderNumberChange} value={newOrder.number} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="order-customer-id" label="Customer ID (select)"
                                onClick={clickOpenCustomerSelector}
                                value={newOrder.customer_id} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="customer" label="Customer"
                                onClick={clickOpenCustomerSelector}
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
                {openCustomerSelector ? <CustomerSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
            </DialogContent>
        </Dialog >
    );
}