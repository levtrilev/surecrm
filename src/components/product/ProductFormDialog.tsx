import * as React from 'react';
import Box from '@mui/material/Box';
import { debounce, Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newProductState } from './data/productState';
import { openProdCategSelectorState, prodCategQuery } from '../productCategory/data/prodCategState';
import { ProdCategSelector } from '../productCategory/ProdCategSelector';
import { isModifiedState } from '../../state/state';
import { useCallback, useEffect, useRef } from 'react';
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
    const isInitialMount = useRef(-2);

    const localEditContext = 'Product.' + product.id;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentProdCateg = useRecoilValue(prodCategQuery(editContext));
    const refreshProdCateg = useRecoilRefresher_UNSTABLE(prodCategQuery(editContext));

    const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openProdCategSelector, setOpenProdCategSelector] = useRecoilState(openProdCategSelectorState);

    const [inputDescriptionValue, setInputDescriptionValue] = React.useState(newProduct.description);
    const [inputNameValue, setInputNameValue] = React.useState(newProduct.name);

    const onProductVatChange = (event: any) => {
        setNewProduct({ ...newProduct, 'vat': event.target.value });
        setIsModified(true);
    };

    // #region onProductNameChange
    const onProductNameChange = (event: any) => {
        setInputNameValue(event.target.value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSendName = useCallback(
        debounce(
            () => {
                setNewProduct({ ...newProduct, 'name': inputNameValue });
                setIsModified(true);
            },
            1000
        ), [inputNameValue]);
    useEffect(() => {
        if (isInitialMount.current < 0) {
            isInitialMount.current += 1;
        } else {
            debouncedSendName();
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [inputNameValue]
    )
    // #endregion onProductNameChange

    // #region onProductDescriptionChange
    const onProductDescriptionChange = (event: any) => {
            setInputDescriptionValue(event.target.value);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSendDescription = useCallback(
        debounce(
            () => {
                setNewProduct({ ...newProduct, 'description': inputDescriptionValue });
                setIsModified(true);
            },
            1000
        ), [inputDescriptionValue]);
    useEffect(() => {
        if (isInitialMount.current < 0) {
            isInitialMount.current += 1;
        } else {
            debouncedSendDescription();
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [inputDescriptionValue]
    );
    // #endregion onProductDescriptionChange

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
                                        {`ID товара: ${product.id} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel control={<Checkbox checked={newProduct.blocked} onChange={onProductBlockedToggle} />} label="товар заблокирован" />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Box mt={2}></Box>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="product-name" label="Название"
                                onChange={onProductNameChange}
                                value={inputNameValue} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="product-category" label="Категория (выберите)"
                                onClick={clickOpenProdCategSelector}
                                value={currentProdCateg.name} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="product-category-id" label="ID Категории"
                                onClick={clickOpenProdCategSelector}
                                value={newProduct.category_id} />
                        </Grid>

                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="product-base-price" label="Цена, руб"
                                onChange={onProductBasePriceChange}
                                value={newProduct.base_price} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="product-vat" label="НДС,%"
                                onChange={onProductVatChange}
                                value={newProduct.vat} />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item xs={true}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={2}
                                id="product-description" label="Описание"
                                // onChange={ (event) => debounce( event, onProductDescriptionChange, 1000)}
                                onChange={onProductDescriptionChange}
                                value={inputDescriptionValue}
                            />
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
                {openProdCategSelector ? <ProdCategSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
            </DialogContent>
        </Dialog>
    );
}
