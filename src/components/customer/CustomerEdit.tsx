import * as React from 'react';
import { postNewCustomer, putUpdatedCustomer } from './data/customerDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { newCustomerState, customersFullQuery, customerQuery, currentCustomerIdState } from './data/customerState'
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import { useEffect, useRef } from 'react';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { CustomerFormDialog } from './CustomerFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const CustomerEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }): JSX.Element => {
    const [currentCustomerId, setCurrentCustomerId] = useRecoilState(currentCustomerIdState(outerEditContext));
    const localEditContext = 'Customer.' + currentCustomerId;
    const isInitialMount = useRef(true);

    const refreshCustomers = useRecoilRefresher_UNSTABLE(customersFullQuery);
    const refreshCustomer = useRecoilRefresher_UNSTABLE(customerQuery(outerEditContext));

    const [newCustomer, setNewCustomer] = useRecoilState(newCustomerState);
    const currentCustomerCategId = useRecoilValue(currentCustCategIdState(outerEditContext));

    const [isModified, setIsModified] = useRecoilState(isModifiedState(localEditContext));
    const [showYesNoCancelDialog, setShowYesNoCancelDialog] = useRecoilState(showYesNoCancelDialogState(localEditContext));
    const [yesNoCancel, setYesNoCancel] = useRecoilState(yesNoCancelState(localEditContext));

    const handleClose = (): void => {
        if (isModified) {
            setShowYesNoCancelDialog(true);
        } else {
            setFromParrent(false);
        }
    };

    const updateCustomer = async (): Promise<void> => {
        if (newCustomer.id === 0) {
            let newCustomerId = await postNewCustomer(newCustomer);
            setCurrentCustomerId(newCustomerId);
            setNewCustomer({ ...newCustomer, id: newCustomerId });
        } else {
            await putUpdatedCustomer(newCustomer);
        }
        setIsModified(false);
        setTimeout(refreshCustomers, 300);
        setTimeout(refreshCustomer, 300);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setNewCustomer({ ...newCustomer, 'category_id': currentCustomerCategId });
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCustomerCategId]);

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateCustomer();
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setFromParrent(false);
        }
        setYesNoCancel('neutral');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <CustomerFormDialog
                updateCustomer={updateCustomer}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentCustomerId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default CustomerEdit;
