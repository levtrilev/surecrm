import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import * as React from 'react';
import PlusOne from '@mui/icons-material/PlusOne';
import { useEffect, useRef } from 'react';
import { currentRoleIdState, newRoleUsersDefault, newRoleState } from './data/roleState';
import { currentUserIdState, newUserDefault, openUserSelectorState, userQuery } from '../user/data/userState';
import { UserSelector } from '../user/UserSelector';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';
import { isModifiedState } from '../../state/state';

interface Props {
    roleUsersEditRef: any;
    roleId: number;
    editContext: string;
}

export const RoleUsersTable: React.FC<Props> = ({ roleUsersEditRef, roleId, editContext }) => {
    const isInitialMountRef = useRef(true);
    const lineIdRef = useRef(0);
    const newLineIdRef = useRef(0);
    const localEditContext = 'Role.' + roleId;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const currentRoleId = useRecoilValue(currentRoleIdState(editContext));
    const [newRole, setNewRole] = useRecoilState(newRoleState);

    const [openUserSelector, setOpenUserSelector] = useRecoilState(openUserSelectorState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));

    const currentUser = useRecoilValue(userQuery(editContext));
    const currentUserId = useRecoilValue(currentUserIdState(editContext));
    const refreshUser = useRecoilRefresher_UNSTABLE(userQuery(editContext));

    const deleteLineAction = (id: number) => {
        let tmp = [] as RoleUsersFullType[];
        for (let i = 0; i < roleUsersEditRef.current.length; i++) {
            if (roleUsersEditRef.current[i].id !== id) {
                tmp.push(roleUsersEditRef.current[i]);
            }
        }
        roleUsersEditRef.current = tmp;
        setIsModified(true);
    }
    const addLineAction = () => {
        let newLine: RoleUsersFullType = { ...newRoleUsersDefault, users: {...newUserDefault, name: "выберите пользователя"} };
        newLine.role_id = currentRoleId;
        setNewRole({...newRole, id: currentRoleId});
        newLine.user_id = 0;
        newLineIdRef.current += 1;
        newLine.id = newLineIdRef.current;
        let tmp = [...roleUsersEditRef.current, newLine];
        roleUsersEditRef.current = tmp;
        setIsModified(true);
    }
    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id;
            const key = params.field.toString();
            const value = params.value;
            let tmp = roleUsersEditRef.current as RoleUsersFullType[];
            roleUsersEditRef.current = tmp.map(el => el.id === id ? { ...el, [key]: value } : el);
            setIsModified(true);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    const clickOpenUserSelector = (id: number) => {
        setOpenUserSelector(true);
        refreshUser();
        paperComponentRef.current = paperComponentDisabledRef.current;
        lineIdRef.current = id;
    }
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
        } else {
            let tmp = roleUsersEditRef.current as RoleUsersFullType[];
            roleUsersEditRef.current = tmp.map(el => el.id === lineIdRef.current ? { ...el, user_id: currentUserId, users: currentUser } : el);
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId]);
    const enableDruggableParent = () => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    function getUserName(params: any) {
        return `${params.row.users?.name || ''}`;
    };
    const prodColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 60,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    {params.id}
                </strong>
            ),
        },
        {
            field: 'user',
            headerName: 'Пользователь',
            width: 180,
            editable: false,
            valueGetter: getUserName,
            renderCell: (params: GridRenderCellParams<number>) => (
                <span onClick={() => clickOpenUserSelector(params.id as number)}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'user_id',
            type: 'number',
            headerName: 'ID пользователя',
            width: 90,
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 70,
            editable: false,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    <IconButton size="medium" onClick={() => deleteLineAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                </strong>
            ),
        },
    ];

    return (
        <>
            <Grid container item spacing={1} columns={16}>
                <Grid item xs={14}>
                    <Typography variant="body1" gutterBottom component="div">
                        {`Роль назначена пользователям:`}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton color="primary" aria-label="add an alarm" onClick={() => addLineAction()}>
                        <PlusOne />
                    </IconButton>
                </Grid>

            </Grid>
            <div style={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={roleUsersEditRef.current}
                    columns={prodColumns}
                    rowHeight={32}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    onCellEditCommit={handleRowEditCommit}
                />
            </div>
            {openUserSelector ? <UserSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
        </>
    );
}