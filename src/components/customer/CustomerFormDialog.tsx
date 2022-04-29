import * as React from 'react';
import Box from '@mui/material/Box';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { currentCustomerIdState, newCustomerState } from './data/customerState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { custCategQuery, openCustCategSelectorState } from '../customerCategory/data/customerCategState';
import { CustCategSelector } from '../customerCategory/CustomerCategSelector';
import { isModifiedState } from '../../state/state';
import { useRef } from 'react';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';

interface Props {
    updateCustomer: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const CustomerFormDialog: React.FC<Props> = ({ updateCustomer,
    handleClose, modalState, editmodeText, editContext }) => {
    const currentCustomerId = useRecoilValue(currentCustomerIdState(editContext));
    const localEditContext = 'Customer.' + currentCustomerId;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentCustomerCateg = useRecoilValue(custCategQuery(editContext));
    const refreshCustomerCateg = useRecoilRefresher_UNSTABLE(custCategQuery(editContext));

    const [newCustomer, setNewCustomer] = useRecoilState(newCustomerState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openCustomerCategSelector, setOpenCustomerCategSelector] = useRecoilState(openCustCategSelectorState);

    const onCustomerNameChange = (event: any): void => {
        setNewCustomer({ ...newCustomer, 'name': event.target.value });
        setIsModified(true);
    };
    const onCustomerBlockedToggle = (event: any): void => {
        setNewCustomer({ ...newCustomer, 'blocked': event.target.checked });
        setIsModified(true);
    };
    const enableDruggableParent = (): void => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    const clickOpenCustomerCategSelector = (): void => {
        setOpenCustomerCategSelector(true);
        refreshCustomerCateg();
        paperComponentRef.current = paperComponentDisabledRef.current;
    }
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
                            <Grid item xs={8}>
                                <Item>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {`Customer id: ${currentCustomerId} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel control={<Checkbox checked={newCustomer.blocked} onChange={onCustomerBlockedToggle} />} label="customer-blocked" />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Box mt={2}></Box>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="customer-name" label="Customer name" onChange={onCustomerNameChange} value={newCustomer.name} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="customer-category-id" label="Category ID (select)"
                                onClick={clickOpenCustomerCategSelector}
                                value={newCustomer.category_id} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="customer-category" label="Category"
                                onClick={clickOpenCustomerCategSelector}
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
                {openCustomerCategSelector ? <CustCategSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
            </DialogContent>
        </Dialog>
    );
}
