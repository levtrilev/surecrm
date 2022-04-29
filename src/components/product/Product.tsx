import { Container, Divider, Grid, IconButton } from '@mui/material';
import React from 'react'
import { useSetRecoilState } from 'recoil';
import { currentProductIdState, newProductState } from './data/productState'
import { openEditModalState, showYesCancelDialogState } from '../../state/state'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { currentProdCategIdState } from '../productCategory/data/prodCategState';
import ButtonGroup from '@mui/material/ButtonGroup';

let editContext = 'Products';

interface Props {
    product: ProductFullType;
}

export const Product: React.FC<Props> = ({ product }) => {
    const setCurrentProductId = useSetRecoilState(currentProductIdState(editContext));
    const setCurrentProdCategId = useSetRecoilState(currentProdCategIdState(editContext));
    const setOpenEditModal = useSetRecoilState(openEditModalState);
    const setShowYesCancelDialog = useSetRecoilState(showYesCancelDialogState(editContext));
    const setNewProduct = useSetRecoilState(newProductState);

    const fullPtoductToProduct = (product: ProductFullType): ProductType => {
        // removes product_categories
        // to transform productFullType to productType
        let { product_categories, ...newProduct } = product;
        return (newProduct);
    };
    return (
        <>
            <Grid container spacing={0} >
                <Grid item xs={1}>
                    <Container>{product.id}</Container>
                </Grid>
                <Grid item xs={6}>
                    <Container>{product.name}</Container>
                </Grid>
                <Grid item xs={2}>
                    <Container>{product.product_categories.name}</Container>
                </Grid>
                <Grid item xs={1}>
                    <Container>{product.blocked ? 'v' : ' '}</Container>
                </Grid>
                <Grid item xs={2} >
                    <Container >
                        <ButtonGroup>
                            <IconButton size="medium" onClick={() => {
                                setShowYesCancelDialog(true);
                                setCurrentProductId(product.id);
                            }}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton size="medium" onClick={() => {
                                setCurrentProductId(product.id);
                                setNewProduct(fullPtoductToProduct(product));
                                setOpenEditModal(true);
                                setCurrentProdCategId(product.category_id);
                            }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="medium" onClick={() => {
                            }}>
                                <ContentCopyIcon />
                            </IconButton>
                        </ButtonGroup>
                    </Container>
                </Grid>
            </Grid>
            <Divider />
        </>
    )
}

export default React.memo(Product)

