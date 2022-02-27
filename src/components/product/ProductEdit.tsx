import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { putUpdatedProduct, postNewProduct } from './data/productDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newProductState, productsFullQuery } from './data/productState'
import { currentProdCategIdState, openProdCategSelectorState } from '../productCategory/productCategoriesState';
import { useEffect } from 'react';
import { ProdCategSelector } from '../productCategory/ProdCategSelector';
import { ProductEditForm } from './ProductEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    product: ProductType;
    editmodeText: string;
}

export const ProductEdit: React.FC<Props> = ({ product, modalState, setFromParrent, editmodeText }) => {
    const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const refreshProducts = useRecoilRefresher_UNSTABLE(productsFullQuery);
    const setOpenProdCategSelector = useSetRecoilState(openProdCategSelectorState);
    const currentProdCategId = useRecoilValue(currentProdCategIdState);
    // const currentProdCateg = useRecoilValue(currentProdCategState);
    let navigate = useNavigate();
    const goToEditDoc = () => {
        navigate("/document", { replace: true });
    }
    const handleClose = () => {
        setFromParrent(false);
    };

    const updateProduct = (product: ProductType) => {
        if (product.id === 0) {
            postNewProduct(product);
        } else {
            putUpdatedProduct(product);
        }
        setTimeout(refreshProducts, 300);
    };
    useEffect(() => {
        setNewProduct({ ...newProduct, 'category_id': currentProdCategId });
        // console.log('ProductEdit useEffect fired!');
    }, [currentProdCategId]);
    
    return (
        <div>
            <ProductEditForm
                product={product}
                updateProduct={updateProduct}
                editmodeText={editmodeText}
                setOpenProdCategSelector={setOpenProdCategSelector}
                ProdCategSelector={ProdCategSelector}
                handleClose={handleClose}
                modalState={modalState}
            />
        </div>
    );
}

export default ProductEdit;
