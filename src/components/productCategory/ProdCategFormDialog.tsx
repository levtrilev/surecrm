import * as React from 'react';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProdCategIdState, newProdCategState } from './data/prodCategState';
import { isModifiedState } from '../../state/state';
import { useRef } from 'react';
import PaperComponent from '../../shared/PaperComponentEnabled';

interface Props {
    updateProdCateg: () => void;
    editmodeText: string;
    handleClose: () => void;
    modalState: boolean;
    editContext: string;
}

export const ProdCategFormDialog: React.FC<Props> = ({ updateProdCateg, editmodeText,
    handleClose, modalState, editContext }) => {
    const currentProdCategId = useRecoilValue(currentProdCategIdState(editContext));
    const localEditContext = 'ProdCateg.' + currentProdCategId;
    const paperComponentRef = useRef(PaperComponent);

    const [newProdCateg, setNewProdCateg] = useRecoilState(newProdCategState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));

    const onProdCategNameChange = (event: any) => {
        setNewProdCateg({ ...newProdCateg, 'name': event.target.value });
        setIsModified(true);
    };

    return (
        <React.Fragment>
            <Dialog
                open={modalState}
                onClose={handleClose}
                PaperComponent={paperComponentRef.current}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogContent>
                    <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        <Typography variant="h6" gutterBottom component="div">
                            {`Categoty id: ${currentProdCategId} (${editmodeText})`}
                        </Typography>
                    </DialogTitle>
                    <Grid container spacing={1}>
                        <Grid container item spacing={3}>
                            <Grid item xs={4}>
                                <TextField id="categoty-name" label="Categoty name" onChange={onProdCategNameChange} value={newProdCateg.name} />
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
                                <Button onClick={updateProdCateg}>
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
        </React.Fragment>
    );
}

export default ProdCategFormDialog;