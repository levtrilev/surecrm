import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import Button from '@mui/material/Button';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { newProdCategState } from './data/prodCategState';
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
    prodCateg: ProductCategoryType;
    updateProdCateg: () => void;
    editmodeText: string;
    handleClose: () => void;
    modalState: boolean;
    editContext: string;
}

export const ProdCategEditForm: React.FC<Props> = ({ prodCateg, updateProdCateg, editmodeText,
    handleClose, modalState, editContext }) => {

    const localEditContext = 'ProdCateg.' + prodCateg.id

    const [newProdCateg, setNewProdCateg] = useRecoilState(newProdCategState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));

    const onProdCategNameChange = (event: any) => {
        setNewProdCateg({ ...newProdCateg, 'name': event.target.value });
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
                                        {`Categoty id: ${prodCateg.id} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                {/* <FormControlLabel control={<Checkbox checked={newCustomerCateg.blocked} onChange={onCustomerCategBlockedToggle} />} label="product-blocked" /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box mt={2}></Box>
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
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default ProdCategEditForm;