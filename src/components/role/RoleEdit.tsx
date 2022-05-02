import * as React from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { currentRoleIdState, newRoleState, roleUsersFullQuery, roleQuery, rolesFullQuery } from './data/roleState';
import { deleteRoleUsers, postNewRole, postRoleUsers, putUpdatedRole } from './data/roleDao';
import { currentTenantIdState } from '../tenant/data/tenantState';
import { useEffect, useRef } from 'react';
import { isModifiedState, showYesNoCancelDialogState, yesNoCancelState } from '../../state/state';
import YesNoCancelDialog from '../../shared/YesNoCancelDialog';
import { RoleFormDialog } from './RoleFormDialog';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    editmodeText: string;
    outerEditContext: string;
}

export const RoleEdit: React.FC<Props> = ({ modalState,
    setFromParrent, editmodeText, outerEditContext }): JSX.Element => {
    const [currentRoleId, setCurrentRoleId] = useRecoilState(currentRoleIdState(outerEditContext));
    const localEditContext = 'Role.' + currentRoleId;
    const isInitialMount = useRef(true);

    const roleUsers = useRecoilValue(roleUsersFullQuery(outerEditContext));
    const roleUsersEditRef = useRef([...roleUsers]);

    const refreshRoles = useRecoilRefresher_UNSTABLE(rolesFullQuery);
    const refreshRole = useRecoilRefresher_UNSTABLE(roleQuery(outerEditContext));
    const refreshRoleUsers = useRecoilRefresher_UNSTABLE(roleUsersFullQuery(outerEditContext));

    const [newRole, setNewRole] = useRecoilState(newRoleState);
    const currentTenantId = useRecoilValue(currentTenantIdState(outerEditContext));

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

    const updateRole = async (): Promise<void> => {
        if (newRole.id === 0) {
            let newRoleId = await postNewRole(newRole);
            setCurrentRoleId(newRoleId);
            setNewRole({ ...newRole, id: newRoleId });
            if (roleUsersEditRef.current.length > 0) {
                const tmp = roleUsersEditRef.current as RoleUsersFullType[];
                roleUsersEditRef.current = tmp.map((el) => { return { ...el, role_id: newRoleId }; });
                postRoleUsers(roleUsersEditRef.current);
            }
        } else {
            await putUpdatedRole(newRole);
            await deleteRoleUsers(newRole.id);
            await postRoleUsers(roleUsersEditRef.current);
        }
        setIsModified(false);
        setTimeout(refreshRoles, 300);
        setTimeout(refreshRole, 300);
        setTimeout(refreshRoleUsers, 300);
    };

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            setNewRole({ ...newRole, 'tenant_id': currentTenantId });
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTenantId]);

    useEffect(() => {
        if (yesNoCancel === 'yes') {
            updateRole();
            setFromParrent(false);
        } else if (yesNoCancel === 'no') {
            setFromParrent(false);
        }
        setYesNoCancel('neutral');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yesNoCancel]);

    return (
        <div>
            <RoleFormDialog
                updateRole={updateRole}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
                editContext={outerEditContext}
                roleUsersEditRef={roleUsersEditRef}
            />
            {showYesNoCancelDialog ? <YesNoCancelDialog
                questionToConfirm={`Save changes (id = ${currentRoleId}) ?`}
                modalState={showYesNoCancelDialog}
                setFromParrent={setShowYesNoCancelDialog}
                editContext={localEditContext}
            /> : <></>}
        </div>
    );
}

export default RoleEdit;
