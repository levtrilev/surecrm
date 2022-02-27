import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { newOrderState } from './data/orderState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { customerQuery } from '../customer/data/customerState';

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
    setOpenCustomerSelector: (selectorState: boolean) => void;
    updateOrder: (order: OrderType) => void;
    handleClose: () => void;
    CustomerSelector: React.FC;
    modalState: boolean;
    editmodeText: string;
}

export const OrderEditForm: React.FC<Props> = ({ order, updateOrder,
    setOpenCustomerSelector, CustomerSelector, handleClose,
    modalState, editmodeText }) => {

    const currentCustomer = useRecoilValue(customerQuery);
    const [newOrder, setNewOrder] = useRecoilState(newOrderState);
    const onOrderNumberChange = (event: any) => {
        setNewOrder({ ...newOrder, 'number': event.target.value });
    };
    // const onOrderBlockedToggle = (event: any) => {
    //     setNewOrder({ ...newOrder, 'blocked': event.target.checked });
    // };
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
                                <TextField id="order-customer-id" label="Customer ID (select)" onClick={() => setOpenCustomerSelector(true)} value={newOrder.customer_id} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField id="customer" label="Customer" onClick={() => setOpenCustomerSelector(true)} value={currentCustomer.name} />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={3}>
                            <Grid item xs={4}>
                                <Button onClick={() => updateOrder(newOrder)}>
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
                    <CustomerSelector />
                </Box>
            </Modal>        </React.Fragment>
    );
}