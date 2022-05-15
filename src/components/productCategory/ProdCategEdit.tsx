import * as React from 'react';
import { putUpdatedProdCateg, postNewProdCateg } from './data/prodCategDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { currentProdCategIdState, newProdCategState, prodCategQuery, prodCategsQuery } from './data/prodCategState'
// import { ProdCategEditForm } from './ProdCategEditForm';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { useEffect } from 'react';
import ProdCategFormDialog from './ProdCategFormDialog';
import { userSectionTenantState } from '../auth/signInState';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const ProdCategEdit: React.FC<Props> = ({ modalState, setFromParrent, editmodeText, outerEditContext }) => {
    const [currentProdCategId, setCurrentProdCategId] = useRecoilState(currentProdCategIdState(outerEditContext));
    const localEditContext = 'ProdCateg.' + currentProdCategId

    const refreshProdCategs = useRecoilRefresher_UNSTABLE(prodCategsQuery);
    const refreshProdCateg = useRecoilRefresher_UNSTABLE(prodCategQuery(outerEditContext));

    const [newProdCateg, setNewProdCateg] = useRecoilState(newProdCategState);

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));
    const userSectionTenant = useRecoilValue(userSectionTenantState);
    
    const handleClose = () => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateProdCateg = async () => {
        if (newProdCateg.id === 0) {
            let newProdCategId = await postNewProdCateg({
                ...newProdCateg,
                section_id: userSectionTenant.section_id,
                tenant_id: userSectionTenant.tenant_id
            });
            setCurrentProdCategId(newProdCategId);
            setNewProdCateg({ ...newProdCateg, id: newProdCategId });
        } else {
            await putUpdatedProdCateg(newProdCateg);
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
                updateProdCateg={updateProdCateg}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentProdCategId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default ProdCategEdit;
