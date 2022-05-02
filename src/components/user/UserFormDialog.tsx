import * as React from 'react';
import Box from '@mui/material/Box';
import { Dialog, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import { Item } from '../../shared/elements';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { currentUserIdState, newUserState } from './data/userState';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { tenantQuery, openTenantSelectorState } from '../tenant/data/tenantState';
import { TenantSelector } from '../tenant/TenantSelector';
import { isModifiedState } from '../../state/state';
import { useRef } from 'react';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';

interface Props {
    updateUser: () => void;
    handleClose: () => void;
    modalState: boolean;
    editmodeText: string;
    editContext: string;
}

export const CustomerFormDialog: React.FC<Props> = ({ updateUser,
    handleClose, modalState, editmodeText, editContext }) => {
    const currentUserId = useRecoilValue(currentUserIdState(editContext));
    const localEditContext = 'User.' + currentUserId;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentUserTenant = useRecoilValue(tenantQuery(editContext));
    const refreshTenant = useRecoilRefresher_UNSTABLE(tenantQuery(editContext));

    const [newUser, setNewUser] = useRecoilState(newUserState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));
    const [openTenantSelector, setOpenTenantSelector] = useRecoilState(openTenantSelectorState);

    const onUserNameChange = (event: any): void => {
        setNewUser({ ...newUser, 'name': event.target.value });
        setIsModified(true);
    };
    const onUserBlockedToggle = (event: any): void => {
        setNewUser({ ...newUser, 'blocked': event.target.checked });
        setIsModified(true);
    };
    const enableDruggableParent = (): void => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    const clickOpenTenantSelector = (): void => {
        setOpenTenantSelector(true);
        refreshTenant();
        paperComponentRef.current = paperComponentDisabledRef.current;
    }
    return (
        <Dialog
            open={modalState}
            onClose={handleClose}
            PaperComponent={paperComponentRef.current}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogContent>
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    <Grid container spacing={1}>
                        <Grid container item spacing={3}>
                            <Grid item xs={8}>
                                <Item>
                                    <Typography variant="h6" gutterBottom component="div">
                                        {`Customer id: ${currentUserId} (${editmodeText})`}
                                    </Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={4}>
                                <FormControlLabel control={<Checkbox checked={newUser.blocked} onChange={onUserBlockedToggle} />} label="user-blocked" />
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Box mt={2}></Box>
                <Grid container spacing={1}>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <TextField id="user-name" label="User name" onChange={onUserNameChange} value={newUser.name} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="user-tenant-id" label="Tenant ID (select)"
                                onClick={clickOpenTenantSelector}
                                value={newUser.tenant_id} />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="user-tenant" label="Tenant"
                                onClick={clickOpenTenantSelector}
                                value={currentUserTenant ? currentUserTenant.name : "not selected"} />
                        </Grid>
                    </Grid>
                    <Grid container item spacing={3}>
                        <Grid item xs={4}>
                            <Button onClick={updateUser}>
                                save
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button onClick={handleClose}>
                                Exit
                            </Button>
                        </Grid>
                        <Grid item xs={4}>
                            {/* <Button onClick={goToEditDoc}>
                                    Go tab
                                </Button> */}
                        </Grid>
                    </Grid>
                </Grid>
                {openTenantSelector ? <TenantSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
            </DialogContent>
        </Dialog>
    );
}
