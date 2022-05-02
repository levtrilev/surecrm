import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newProductState } from './data/productState';
import { openProdCategSelectorState, prodCategQuery } from '../productCategory/data/prodCategState';
import { ProdCategSelector } from '../productCategory/ProdCategSelector';
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
    product: ProductType;
    updateProduct: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const ProductEditForm: React.FC<Props> = ({ product, updateProduct,
    handleClose, modalState, editmodeText, editContext }) => {
    const localEditContext = 'Product.' + product.id;

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
                                        {`Product id: ${product.id} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel control={<Checkbox checked={newProduct.blocked} onChange={onProductBlockedToggle} />} label="product-blocked" />
                            </Grid>
                        </Grid>
                    </Grid>
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
                                    onClick={() => {setOpenProdCategSelector(true); refreshProdCateg()}}
                                    value={newProduct.category_id} />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField id="product-category" label="Category"
                                    onClick={() => {setOpenProdCategSelector(true); refreshProdCateg()}}
                                    value={currentProdCateg ? currentProdCateg.name : "not selected"} />
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
                    {openProdCategSelector ? <ProdCategSelector editContext={editContext} enableDruggableParent={() => { }} /> : <></>}
                </Box>
            </Modal>
        </React.Fragment>
    );
}
