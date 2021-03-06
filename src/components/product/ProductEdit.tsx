import * as React from 'react';
import { putUpdatedProduct, postNewProduct } from './data/productDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { currentProductIdState, newProductState, productQuery, productsFullQuery } from './data/productState'
import { currentProdCategIdState } from '../productCategory/data/prodCategState';
import { useEffect, useRef } from 'react';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { ProductFormDialog } from './ProductFormDialog';
import { userSectionTenantState } from '../auth/signInState';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const ProductEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }) => {
    const [currentProductId, setCurrentProductId] = useRecoilState(currentProductIdState(outerEditContext));
    const localEditContext = 'Product.' + currentProductId;
    const isInitialMount = useRef(true);

    const refreshProduct = useRecoilRefresher_UNSTABLE(productQuery(outerEditContext));
    const refreshProducts = useRecoilRefresher_UNSTABLE(productsFullQuery);

    const [newProduct, setNewProduct] = useRecoilState(newProductState);
    const currentProdCategId = useRecoilValue(currentProdCategIdState(outerEditContext));

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));
    const userSectionTenant = useRecoilValue(userSectionTenantState);
    
    const handleClose = (): void => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateProduct = async (): Promise<void> => {
        if (newProduct.id === 0) {
            let newProductId = await postNewProduct({
                ...newProduct,
                section_id: userSectionTenant.section_id,
                tenant_id: userSectionTenant.tenant_id
            });
            setCurrentProductId(newProductId);
            setNewProduct({ ...newProduct, id: newProductId });
        } else {
            await putUpdatedProduct(newProduct);
        }
        setIsModified(false);
        setTimeout(refreshProducts, 300);
        setTimeout(refreshProduct, 300);
    };
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setNewProduct({ ...newProduct, 'category_id': currentProdCategId });
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProdCategId]);

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateProduct();
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setFromParrent(false);
        } else {
        }
        setYesNoCancel('neutral');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <ProductFormDialog
                updateProduct={updateProduct}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentProductId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default ProductEdit;
