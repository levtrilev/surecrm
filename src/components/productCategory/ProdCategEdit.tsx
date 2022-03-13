import * as React from 'react';
import { putUpdatedProdCateg, postNewProdCateg } from './data/prodCategDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { newProdCategState, prodCategQuery, prodCategsQuery } from './data/prodCategState'
// import { ProdCategEditForm } from './ProdCategEditForm';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { useEffect } from 'react';
import ProdCategFormDialog from './ProdCategFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    prodCateg: ProductCategoryType;
    editmodeText: string;
    editContext: string;
}

export const ProdCategEdit: React.FC<Props> = ({ prodCateg, modalState, setFromParrent, editmodeText, editContext }) => {
    const localEditContext = 'ProdCateg.' + prodCateg.id

    const refreshProdCategs = useRecoilRefresher_UNSTABLE(prodCategsQuery);
    const refreshProdCateg = useRecoilRefresher_UNSTABLE(prodCategQuery(editContext));

    const newProdCateg = useRecoilValue(newProdCategState);

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

    const updateProdCateg = () => {
        if (newProdCateg.id === 0) {
            postNewProdCateg(newProdCateg);
        } else {
            putUpdatedProdCateg(newProdCateg);
        }
        setIsModified(false);
        setTimeout(refreshProdCategs, 300);
        setTimeout(refreshProdCateg, 300);
    };

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateProdCateg();
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setFromParrent(false);
        }
        setYesNoCancel('neutral');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <ProdCategFormDialog
                prodCateg={prodCateg}
                updateProdCateg={updateProdCateg}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
                editContext={editContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${prodCateg.id}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default ProdCategEdit;
