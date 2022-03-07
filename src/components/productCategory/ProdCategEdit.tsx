import * as React from 'react';
import { putUpdatedProdCateg, postNewProdCateg } from './data/prodCategDao';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { prodCategQuery, prodCategsQuery } from './data/prodCategState'
import { ProdCategEditForm } from './ProdCategEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    prodCateg: ProductCategoryType;
    editmodeText: string;
    editContext: string;
}

export const ProdCategEdit: React.FC<Props> = ({ prodCateg, modalState, setFromParrent, editmodeText, editContext }) => {
    const refreshProdCategs = useRecoilRefresher_UNSTABLE(prodCategsQuery);
    const refreshProdCateg = useRecoilRefresher_UNSTABLE(prodCategQuery(editContext));
    
    const handleClose = () => {
        setFromParrent(false);
    };

    const updateProdCateg = (prodCateg: ProductCategoryType) => {
        if (prodCateg.id === 0) {
            postNewProdCateg(prodCateg);
        } else {
            putUpdatedProdCateg(prodCateg);
        }
        setTimeout(refreshProdCategs, 300);
        setTimeout(refreshProdCateg, 300);
    };
    
    return (
        <div>
            <ProdCategEditForm
                prodCateg={prodCateg}
                updateProdCateg={updateProdCateg}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
            />
        </div>
    );
}

export default ProdCategEdit;
