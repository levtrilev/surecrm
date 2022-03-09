import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { newCustomerState } from './data/customerState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { custCategQuery, openCustCategSelectorState } from '../customerCategory/data/customerCategState';
import { CustCategSelector } from '../customerCategory/CustomerCategSelector';
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
    customer: CustomerType;
    updateCustomer: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const CustomerEditForm: React.FC<Props> = ({ customer, updateCustomer,
    handleClose, modalState, editmodeText, editContext }) => {
    const localEditContext = 'Customer.' + customer.id

    const currentCustomerCateg = useRecoilValue(custCategQuery(editContext));
    const refreshCustomerCateg = useRecoilRefresher_UNSTABLE(custCategQuery(editContext));

    const [newCustomer, setNewCustomer] = useRecoilState(newCustomerState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openCustomerCategSelector, setOpenCustomerCategSelector] = useRecoilState(openCustCategSelectorState);

    const onCustomerNameChange = (event: any) => {
        setNewCustomer({ ...newCustomer, 'name': event.target.value });
        setIsModified(true);
    };
    const onCustomerBlockedToggle = (event: any) => {
        setNewCustomer({ ...newCustomer, 'blocked': event.target.checked });
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
                            <Grid item xs={8}>
                                <Item>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {`Customer id: ${customer.id} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel control={<Checkbox checked={newCustomer.blocked} onChange={onCustomerBlockedToggle} />} label="customer-blocked" />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box mt={2}></Box>
                    <Grid container spacing={1}>
                        <Grid container item spacing={3}>
                            <Grid item xs={4}>
                                <TextField id="customer-name" label="Customer name" onChange={onCustomerNameChange} value={newCustomer.name} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField id="customer-category-id" label="Category ID (select)"
                                    onClick={() => { setOpenCustomerCategSelector(true); refreshCustomerCateg(); }}
                                    value={newCustomer.category_id} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField id="customer-category" label="Category"
                                    onClick={() => { setOpenCustomerCategSelector(true); refreshCustomerCateg(); }}
                                    value={currentCustomerCateg.name} />
                            </Grid>
                        </Grid>
                        <Grid container item spacing={3}>
                            <Grid item xs={4}>
                                <Button onClick={updateCustomer}>
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
                    {openCustomerCategSelector ? <CustCategSelector editContext={editContext} /> : <></>}
                </Box>
            </Modal>
        </React.Fragment>
    );
}
