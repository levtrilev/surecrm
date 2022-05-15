import * as React from 'react';
import { putUpdatedCustomerCateg, postNewCustomerCateg } from './data/customerCategDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { currentCustCategIdState, custCategQuery, custCategsQuery, newCustCategState } from './data/customerCategState'
// import { CustomerCategEditForm } from './CustomerCategEditForm';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { useEffect } from 'react';
import { CustomerCategFormDialog } from './CustomerCategFormDialog';
import { userSectionTenantState } from '../auth/signInState';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const CustomerCategEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }) => {

    const [currentCustCategId, setCurrentCustCategId] = useRecoilState(currentCustCategIdState(outerEditContext));
    const localEditContext = 'CustomerCateg.' + currentCustCategId;

    const refreshCustomerCategs = useRecoilRefresher_UNSTABLE(custCategsQuery);
    const refreshCustomerCateg = useRecoilRefresher_UNSTABLE(custCategQuery(outerEditContext));

    const [newCustomerCateg, setNewCustomerCateg] = useRecoilState(newCustCategState);

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

    const updateCustomerCateg = async () => {
        if (newCustomerCateg.id === 0) {
            let newCustomerCategId = await postNewCustomerCateg({
                ...newCustomerCateg,
                section_id: userSectionTenant.section_id,
                tenant_id: userSectionTenant.tenant_id
            });
            setCurrentCustCategId(newCustomerCategId);
            setNewCustomerCateg({
                ...newCustomerCateg, id: newCustomerCategId
            });
            // debugger;
        } else {
            await putUpdatedCustomerCateg(newCustomerCateg);
        }
        setIsModified(false);
        setTimeout(refreshCustomerCategs, 300);
        setTimeout(refreshCustomerCateg, 300);
    };

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateCustomerCateg();
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
            <CustomerCategFormDialog
                updateCustomerCateg={updateCustomerCateg}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentCustCategId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default CustomerCategEdit;
