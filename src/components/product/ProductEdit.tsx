import * as React from 'react';
import { putUpdatedProduct, postNewProduct } from './data/productDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newProductState, productsFullQuery } from './data/productState'
import { currentProdCategIdState, openProdCategSelectorState } from '../productCategory/data/prodCategState';
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

    // let navigate = useNavigate();
    // const goToEditDoc = () => {
    //     navigate("/document", { replace: true });
    // }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
