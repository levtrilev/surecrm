import * as React from 'react';
import { putUpdatedProduct, postNewProduct } from './data/productDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useSetRecoilState } from 'recoil';
import { newProductState, productQuery, productsFullQuery } from './data/productState'
import { currentProdCategIdState, openProdCategSelectorState } from '../productCategory/data/prodCategState';
import { useEffect } from 'react';
import { ProductEditForm } from './ProductEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    product: ProductType;
    editmodeText: string;
}

export const ProductEdit: React.FC<Props> = ({ product, modalState, setFromParrent, editmodeText }) => {
    const editContext = 'prod.' + product.id;

    const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const refreshProducts = useRecoilRefresher_UNSTABLE(productsFullQuery);
    const [currentProdCategId, setCurrentProdCategId] = useRecoilState(currentProdCategIdState(editContext));
    const refreshProduct = useRecoilRefresher_UNSTABLE(productQuery);

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
        setTimeout(refreshProduct, 300);
    };
    useEffect(() => {
        if (currentProdCategId === 0) {
            setCurrentProdCategId(product.category_id);
        }    
        setNewProduct({ ...newProduct, 'category_id': currentProdCategId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProdCategId]);
    
    return (
        <div>
            <ProductEditForm
                product={product}
                updateProduct={updateProduct}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
            />
        </div>
    );
}

export default ProductEdit;
