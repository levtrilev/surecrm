import * as React from 'react';
import { Checkbox, debounce, Dialog, DialogContent, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { currentRoleIdState, newRoleState } from './data/roleState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { tenantQuery, openTenantSelectorState } from '../tenant/data/tenantState';
import { TenantSelector } from '../tenant/TenantSelector';
import { isModifiedState } from '../../state/state';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';
import { useCallback, useEffect, useRef } from 'react';
import { RoleUsersTable } from './RoleUsersTable';

interface Props {
    updateRole: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
    roleUsersEditRef: any;
}

export const RoleFormDialog: React.FC<Props> = ({ updateRole,
    handleClose, modalState, editmodeText, editContext, roleUsersEditRef }) => {

    const isInitialMount = useRef(-1);
    const currentRoleId = useRecoilValue(currentRoleIdState(editContext));
    const localEditContext = 'Role.' + currentRoleId;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentTenant = useRecoilValue(tenantQuery(editContext));
    const refreshTenant = useRecoilRefresher_UNSTABLE(tenantQuery(editContext));

    const [newRole, setNewRole] = useRecoilState(newRoleState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openTenantSelector, setOpenTenantSelector] = useRecoilState(openTenantSelectorState);

    const [roleDescriptionValue, setRoleDescriptionValue] = React.useState(newRole.description);

    // #region onOrderDescriptionChange
    const onRoleDescriptionChange = (event: any): void => {
        setRoleDescriptionValue(event.target.value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSendDescription = useCallback(
        debounce(
            () => {
                setNewRole({ ...newRole, 'description': roleDescriptionValue });
                setIsModified(true);
            },
            1000
        ), [roleDescriptionValue]);
    useEffect(() => {
        if (isInitialMount.current < 0) {
            isInitialMount.current += 1;
        } else {
            debouncedSendDescription();
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [roleDescriptionValue]
    );
    // #endregion onOrderDescriptionChange

    const onRoleNameChange = (event: any): void => {
        setNewRole({ ...newRole, 'name': event.target.value });
        setIsModified(true);
    };

    const enableDruggableParent = (): void => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    const clickOpenTenantSelector = (): void => {
        setOpenTenantSelector(true);
        refreshTenant();
        paperComponentRef.current = paperComponentDisabledRef.current;
    };
    const onRoleBlockedToggle = (event: any): void => {
        setNewRole({ ...newRole, 'blocked': event.target.checked });
        setIsModified(true);
    };
    return (
        <Dialog
            open={modalState}
            onClose={handleClose}
            PaperComponent={paperComponentRef.current}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogContent>
                <Grid container spacing={1} columns={16}>
                    <Grid item xs={9}>
                        <Typography variant="subtitle2" gutterBottom component="div">
                            {`Роль ${newRole.name} (id: ${currentRoleId} ${editmodeText})`}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControlLabel control={<Checkbox checked={newRole.blocked}
                            onChange={onRoleBlockedToggle} />} label="заблокировано" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={updateRole}>
                            save
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={handleClose}>
                            Exit
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={1} columns={16}>
                    <Grid item xs={16}>
                        <hr />
                    </Grid>
                </Grid>
                <Grid container item spacing={1} columns={16}>
                    <Grid item xs={4}>
                        <TextField id="role-name" label="Роль" onChange={onRoleNameChange}
                            value={newRole.name} size="small" margin="dense" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField id="tenant" label="Tenant(выберите)"
                            onClick={clickOpenTenantSelector} fullWidth
                            value={currentTenant ? currentTenant.name: "not selected"} size="small" margin="dense" />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField id="role-tenant-id" label="ID"
                            onClick={clickOpenTenantSelector}
                            value={newRole.tenant_id} size="small" margin="dense" />
                    </Grid>
                </Grid>
                <Grid container item spacing={1} columns={16}>

                    <Grid item xs={12}>
                        <TextField id="description" label="Описание" onChange={onRoleDescriptionChange}
                            value={roleDescriptionValue} size="small" margin="dense" fullWidth />
                    </Grid>
                </Grid>
                <RoleUsersTable
                    roleUsersEditRef={roleUsersEditRef}
                    roleId={currentRoleId}
                    editContext={editContext}
                />
                {openTenantSelector ? <TenantSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
            </DialogContent>
        </Dialog >
    );
}