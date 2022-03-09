import * as React from 'react';
import { putUpdatedCustomerCateg, postNewCustomerCateg } from './data/customerCategDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { custCategQuery, custCategsQuery, newCustCategState } from './data/customerCategState'
import { CustomerCategEditForm } from './CustomerCategEditForm';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { useEffect } from 'react';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    customerCateg: CustomerCategoryType;
    editmodeText: string;
    outerEditContext: string;
}

export const CustomerCategEdit: React.FC<Props> = ({ customerCateg, modalState,
    setFromParrent, editmodeText, outerEditContext }) => {
    const localEditContext = 'CustomerCateg.' + customerCateg.id
    
    const refreshCustomerCategs = useRecoilRefresher_UNSTABLE(custCategsQuery);
    const refreshCustomerCateg = useRecoilRefresher_UNSTABLE(custCategQuery(outerEditContext));

    const newCustomerCateg = useRecoilValue(newCustCategState);

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));

    const handleClose = () => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        }
    };

    const updateCustomerCateg = () => {
        if (newCustomerCateg.id === 0) {
            postNewCustomerCateg(newCustomerCateg);
        } else {
            putUpdatedCustomerCateg(newCustomerCateg);
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
            <CustomerCategEditForm
                customerCateg={customerCateg}
                updateCustomerCateg={updateCustomerCateg}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${customerCateg.id}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default CustomerCategEdit;
