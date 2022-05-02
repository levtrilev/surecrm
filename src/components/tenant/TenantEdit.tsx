import * as React from 'react';
import { putUpdatedTenant, postNewTenant } from './data/tenantDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { currentTenantIdState, tenantQuery, tenantsQuery, newTenantState } from './data/tenantState'
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { useEffect } from 'react';
import { TenantFormDialog } from './TenantFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const TenantEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }) => {
        const [currentTenantId, setCurrentTenantId] = useRecoilState(currentTenantIdState(outerEditContext));

    const localEditContext: string = 'Tenant.' + currentTenantId;
    
    const refreshTenants = useRecoilRefresher_UNSTABLE(tenantsQuery);
    const refreshTenant = useRecoilRefresher_UNSTABLE(tenantQuery(outerEditContext));

    const [newTenant, setNewTenant] = useRecoilState(newTenantState);

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

    const updateTenant = async () => {
        if (newTenant.id === 0) {
            let newTenantId = await postNewTenant(newTenant);
            setCurrentTenantId(newTenantId);
            setNewTenant({ ...newTenant, id: newTenantId });
        } else {
            await putUpdatedTenant(newTenant);
        }
        setIsModified(false);
        setTimeout(refreshTenants, 300);
        setTimeout(refreshTenant, 300);
    };

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateTenant();
            setYesNoCancel('neutral');
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setYesNoCancel('neutral');
            setFromParrent(false);
        } else {
            setYesNoCancel('neutral');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);
    return (
        <div>
            <TenantFormDialog
                updateTenant={updateTenant}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentTenantId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default TenantEdit;
