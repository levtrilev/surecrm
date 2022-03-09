import * as React from 'react';
import { putUpdatedProduct, postNewProduct } from './data/productDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { newProductState, productQuery, productsFullQuery } from './data/productState'
import { currentProdCategIdState } from '../productCategory/data/prodCategState';
import { useEffect } from 'react';
import { ProductEditForm } from './ProductEditForm';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    product: ProductType;
    editmodeText: string;
    outerEditContext: string;
}

export const ProductEdit: React.FC<Props> = ({ product, modalState,
    setFromParrent, editmodeText, outerEditContext }) => {
    const localEditContext = 'Product.' + product.id;

    const refreshProduct = useRecoilRefresher_UNSTABLE(productQuery(outerEditContext));
    const refreshProducts = useRecoilRefresher_UNSTABLE(productsFullQuery);

    const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const [currentProdCategId, setCurrentProdCategId] = useRecoilState(currentProdCategIdState(outerEditContext));

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));

    const handleClose = () => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateProduct = () => {
        if (newProduct.id === 0) {
            postNewProduct(newProduct);
        } else {
            putUpdatedProduct(newProduct);
        }
        setIsModified(false);
        setTimeout(refreshProducts, 300);
        setTimeout(refreshProduct, 300);
    };
    useEffect(() => {
        if (currentProdCategId === 0) {
            setCurrentProdCategId(product.category_id);
        }
        setNewProduct({ ...newProduct, 'category_id': currentProdCategId });
        setIsModified(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProdCategId]);

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateProduct();
            setFromParrent(false);
            // setYesNoCancel('neutral');
        } else if (yesNoCancel === 'no') {
            // setYesNoCancel('neutral');
            setFromParrent(false);
        } else {
            // setYesNoCancel('neutral');
        }
        setYesNoCancel('neutral');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <ProductEditForm
                product={product}
                updateProduct={updateProduct}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${product.id}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default ProductEdit;
