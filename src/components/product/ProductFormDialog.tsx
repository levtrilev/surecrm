import * as React from 'react';
import Box from '@mui/material/Box';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newProductState } from './data/productState';
import { openProdCategSelectorState, prodCategQuery } from '../productCategory/data/prodCategState';
import { ProdCategSelector } from '../productCategory/ProdCategSelector';
import { isModifiedState } from '../../state/state';
import { useRef } from 'react';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';

interface Props {
    product: ProductType;
    updateProduct: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const ProductFormDialog: React.FC<Props> = ({ product, updateProduct,
    handleClose, modalState, editmodeText, editContext }) => {
    const localEditContext = 'Product.' + product.id;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentProdCateg = useRecoilValue(prodCategQuery(editContext));
    const refreshProdCateg = useRecoilRefresher_UNSTABLE(prodCategQuery(editContext));

    const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openProdCategSelector, setOpenProdCategSelector] = useRecoilState(openProdCategSelectorState);

    const onProductVatChange = (event: any) => {
        setNewProduct({ ...newProduct, 'vat': event.target.value });
        setIsModified(true);
    };
    const onProductNameChange = (event: any) => {
        setNewProduct({ ...newProduct, 'name': event.target.value });
        setIsModified(true);
    };
    const onProductBlockedToggle = (event: any) => {
        setNewProduct({ ...newProduct, 'blocked': event.target.checked });
        setIsModified(true);
    };
    const onProductBasePriceChange = (event: any) => {
        setNewProduct({ ...newProduct, 'base_price': event.target.value });
        setIsModified(true);
    };
    const enableDruggableParent = () => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    const clickOpenProdCategSelector = () => {
        setOpenProdCategSelector(true);
        refreshProdCateg();
        paperComponentRef.current = paperComponentDisabledRef.current;    }
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
                                        {`Product id: ${product.id} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel control={<Checkbox checked={newProduct.blocked} onChange={onProductBlockedToggle} />} label="product-blocked" />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Box mt={2}></Box>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="product-name" label="Product name"
                                onChange={onProductNameChange}
                                value={newProduct.name} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="product-category-id" label="Category ID (select)"
                                onClick={clickOpenProdCategSelector}
                                value={newProduct.category_id} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="product-category" label="Category"
                                onClick={clickOpenProdCategSelector}
                                value={currentProdCateg.name} />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="product-base-price" label="Base price"
                                onChange={onProductBasePriceChange}
                                value={newProduct.base_price} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="product-vat" label="VAT,%"
                                onChange={onProductVatChange}
                                value={newProduct.vat} />
                        </Grid>
                    </Grid>

                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <Button onClick={updateProduct}>
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
                {openProdCategSelector ? <ProdCategSelector editContext={editContext} enableDruggableParent={enableDruggableParent}/> : <></>}
            </DialogContent>
        </Dialog>
    );
}
