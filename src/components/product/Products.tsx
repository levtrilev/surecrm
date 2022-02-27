import React, { useEffect } from 'react'
import {
    useRecoilState,
    useRecoilValue,
    useRecoilRefresher_UNSTABLE,
} from 'recoil';
import { currentProductIdState, productQuery } from './data/productState'
import { productsFullQuery } from './data/productState'
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import Product from './Product';
import { Container, Grid } from '@mui/material';
import { ProductEdit } from './ProductEdit';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { deleteProduct } from './data/productDao';

const Products: React.FC = () => {

    const products = useRecoilValue(productsFullQuery) as ProductFullType[];
    const refreshProducts = useRecoilRefresher_UNSTABLE(productsFullQuery);
    // const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const productToOpen = useRecoilValue(productQuery);
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState);
    const currentProductId = useRecoilValue(currentProductIdState);
    let editmodeText = 'edit mode';

    // const onNewProductNameChange = (event: any) => {
    //     setNewProduct({ ...newProduct, 'name': event.target.value });
    // };

    useEffect(() => {
        if (yesCancel) {
            deleteProduct(currentProductId);
            setTimeout(refreshProducts, 300);
            setYesCancel(false);
        }
    }, [currentProductId, refreshProducts, setYesCancel, yesCancel]);

    return (
        <div style={{ margin: 80 }}>
            <div className="blog-content layout">
                <Grid container spacing={0} border={0.5}>
                    <Grid item xs={1}>
                        <Container>id</Container>
                    </Grid>
                    <Grid item xs={6}>
                        <Container>Product</Container>
                    </Grid>
                    <Grid item xs={2}>
                        <Container>Category</Container>
                    </Grid>
                    <Grid item xs={1}>
                        <Container>Blocked</Container>
                    </Grid>
                    <Grid item xs={2}>
                        <Container style={{ paddingLeft: 32, paddingRight: 4, alignItems: 'center', justifyContent: 'center' }}>Actions</Container>
                    </Grid>
                </Grid>
                {products.length ? products.map(product => <Product key={product.id} product={product} />) : <tr>"Нет записей"</tr>}
            </div>
            {openEditModal ? <ProductEdit
                product={productToOpen}
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText={editmodeText}
            /> : <></>}
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete product (id = ${productToOpen.id}) ?`} modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} /> : <></>}
        </div>
    )
}

export default Products
