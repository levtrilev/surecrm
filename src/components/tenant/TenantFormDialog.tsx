import * as React from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import Button from '@mui/material/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentTenantIdState, newTenantState } from './data/tenantState';
import { isModifiedState } from '../../state/state';
import { useRef } from 'react';
import PaperComponent from '../../shared/PaperComponentEnabled';

interface Props {
    updateTenant: () => void;
    editmodeText: string;
    handleClose: () => void;
    modalState: boolean;
    editContext: string; // in case for newTenantState to be a Family
}

export const TenantFormDialog: React.FC<Props> = ({ updateTenant, editmodeText,
    handleClose, modalState, editContext }) => {
    const currentTenantId = useRecoilValue(currentTenantIdState(editContext));
    const localEditContext = 'Tenant.' + currentTenantId;
    const paperComponentRef = useRef(PaperComponent);

    const [newTenant, setNewTenant] = useRecoilState(newTenantState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));

    const onTenantNameChange = (event: any) => {
        setNewTenant({ ...newTenant, 'name': event.target.value });
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
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <Grid container spacing={1}>
                        <Grid container item spacing={3}>
                            <Grid item xs={8}>
                                <Item>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {`Tenant id: ${currentTenantId} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                {/* <FormControlLabel control={<Checkbox checked={newCustomerCateg.blocked} onChange={onCustomerCategBlockedToggle} />} label="product-blocked" /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="tenant-name" label="Tenant name" onChange={onTenantNameChange} value={newTenant.name} />
                        </Grid>
                        <Grid item xs={4}>
                            {/* <TextField id="product-category-id" label="Category ID (select)" onClick={() => setOpenProdCategSelector(true)} value={newProduct.category_id} /> */}
                        </Grid>
                        <Grid item xs={4}>
                            {/* <TextField id="product-category" label="Category" onClick={() => setOpenProdCategSelector(true)} value={currentProdCateg.name} /> */}
                        </Grid>
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            {/* <TextField id="product-base-price" label="Base price" onChange={onProductBasePriceChange} value={newProduct.base_price} /> */}
                        </Grid>
                        <Grid item xs={4}>
                            {/* <TextField id="product-vat" label="VAT,%" onChange={onProductVatChange} value={newProduct.vat} /> */}
                        </Grid>
                    </Grid>

                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <Button onClick={updateTenant}>
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
            </DialogContent>
        </Dialog>
    );
}
