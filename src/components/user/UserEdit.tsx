import * as React from 'react';
import { postNewUser, putUpdatedUser } from './data/userDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { newUserState, usersFullQuery, userQuery, currentUserIdState } from './data/userState'
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import { useEffect, useRef } from 'react';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { CustomerFormDialog } from './UserFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const UserEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }): JSX.Element => {
    const [currentUserId, setCurrentUserId] = useRecoilState(currentUserIdState(outerEditContext));
    const localEditContext = 'User.' + currentUserId;
    const isInitialMount = useRef(true);

    const refreshUsers = useRecoilRefresher_UNSTABLE(usersFullQuery);
    const refreshUser = useRecoilRefresher_UNSTABLE(userQuery(outerEditContext));

    const [newUser, setNewUser] = useRecoilState(newUserState);
    const currentUserTenantId = useRecoilValue(currentCustCategIdState(outerEditContext));/////////////

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

    const updateUser = async (): Promise<void> => {
        if (newUser.id === 0) {
            let newUserId = await postNewUser(newUser);
            setCurrentUserId(newUserId);
            setNewUser({ ...newUser, id: newUserId });
        } else {
            await putUpdatedUser(newUser);
        }
        setIsModified(false);
        setTimeout(refreshUsers, 300);
        setTimeout(refreshUser, 300);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setNewUser({ ...newUser, 'tenant_id': currentUserTenantId });
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserTenantId]);

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateUser();
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
                updateUser={updateUser}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentUserId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default UserEdit;
