import * as React from 'react';
import { Checkbox, debounce, Dialog, DialogContent, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { currentOrderIdState, newOrderState } from './data/orderState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { customerQuery, openCustomerSelectorState } from '../customer/data/customerState';
import { CustomerSelector } from '../customer/CustomerSelector';
import { isModifiedState } from '../../state/state';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';
import { useCallback, useEffect, useRef } from 'react';
import { OrderProductsTable } from './OrderProductsTable';

interface Props {
    updateOrder: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
    orderProductsEditRef: any;
}

export const OrderFormDialog: React.FC<Props> = ({ updateOrder,
    handleClose, modalState, editmodeText, editContext, orderProductsEditRef }) => {

    const isInitialMount = useRef(-1);
    const currentOrderId = useRecoilValue(currentOrderIdState(editContext));
    const localEditContext = 'Order.' + currentOrderId;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentCustomer = useRecoilValue(customerQuery(editContext));
    const refreshCustomer = useRecoilRefresher_UNSTABLE(customerQuery(editContext));

    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openCustomerSelector, setOpenCustomerSelector] = useRecoilState(openCustomerSelectorState);

    const [orderDescriptionValue, setOrderDescriptionValue] = React.useState(newOrder.description);

    // #region onOrderDescriptionChange
    const onOrderDescriptionChange = (event: any): void => {
        setOrderDescriptionValue(event.target.value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSendDescription = useCallback(
        debounce(
            () => {
                setNewOrder({ ...newOrder, 'description': orderDescriptionValue });
                setIsModified(true);
            },
            1000
        ), [orderDescriptionValue]);
    useEffect(() => {
        if (isInitialMount.current < 0) {
            isInitialMount.current += 1;
        } else {
            debouncedSendDescription();
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [orderDescriptionValue]
    );
    // #endregion onOrderDescriptionChange

    const onOrderNumberChange = (event: any): void => {
        setNewOrder({ ...newOrder, 'number': event.target.value, 'name': event.target.value });
        setIsModified(true);
    };
    const onOrderTotalAmountChange = (event: any): void => {
        setNewOrder({ ...newOrder, 'total_amount': event.target.value });
        setIsModified(true);
    };
    const enableDruggableParent = (): void => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    const clickOpenCustomerSelector = (): void => {
        setOpenCustomerSelector(true);
        refreshCustomer();
        paperComponentRef.current = paperComponentDisabledRef.current;
    };
    const onOrderDeletedToggle = (event: any): void => {
        setNewOrder({ ...newOrder, 'deleted': event.target.checked });
        setIsModified(true);
    };
    return (
        <Dialog
            open={modalState}
            onClose={handleClose}
            PaperComponent={paperComponentRef.current}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogContent>
                <Grid container spacing={1} columns={16}>
                    <Grid item xs={9}>
                        <Typography variant="subtitle2" gutterBottom component="div">
                            {`Заказ №${newOrder.number} (id: ${currentOrderId} ${editmodeText})`}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel control={<Checkbox checked={newOrder.deleted}
                            onChange={onOrderDeletedToggle} />} label="отменено" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={updateOrder}>
                            save
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={handleClose}>
                            Exit
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={1} columns={16}>
                    <Grid item xs={16}>
                        <hr />
                    </Grid>
                </Grid>
                <Grid container item spacing={1} columns={16}>
                    <Grid item xs={4}>
                        <TextField id="order-number" label="Номер заказа" onChange={onOrderNumberChange}
                            value={newOrder.number} size="small" margin="dense" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="order-date" label="Дата заказа"
                            value={newOrder.date} size="small" margin="dense" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField id="customer" label="Покупатель(выберите)"
                            onClick={clickOpenCustomerSelector} fullWidth
                            value={currentCustomer ? currentCustomer.name: "not selected"} size="small" margin="dense" />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField id="order-customer-id" label="ID"
                            onClick={clickOpenCustomerSelector}
                            value={newOrder.customer_id} size="small" margin="dense" />
                    </Grid>
                </Grid>
                <Grid container item spacing={1} columns={16}>
                    <Grid item xs={4}>
                        <TextField type="number"
                            id="total_amount" label="Сумма заказа, руб"
                            value={newOrder.total_amount} size="small" margin="dense"
                            onChange={onOrderTotalAmountChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="description" label="Описание" onChange={onOrderDescriptionChange}
                            value={orderDescriptionValue} size="small" margin="dense" fullWidth />
                    </Grid>
                </Grid>
                <OrderProductsTable
                    orderProductsEditRef={orderProductsEditRef}
                    orderId={currentOrderId}
                    editContext={editContext}
                />
                {openCustomerSelector ? <CustomerSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
            </DialogContent>
        </Dialog >
    );
}