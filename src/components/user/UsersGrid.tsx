import * as React from 'react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEventListener, GridEvents, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { UserEdit } from './UserEdit';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { deleteUser } from './data/userDao';
import { currentUserIdState, currentUserTenantIdState, newUserDefault, newUserState, usersFullQuery } from './data/userState'
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';

let editmodeText = '';
const editContext = 'UsersGrid';

export default function UsersGrid(): JSX.Element {

    const users = useRecoilValue(usersFullQuery);
    const refreshUsers = useRecoilRefresher_UNSTABLE(usersFullQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [currentUserId, setCurrentUserId] = useRecoilState(currentUserIdState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const setNewUser = useSetRecoilState(newUserState);
    const setCurrentUserTenantId = useSetRecoilState(currentUserTenantIdState(editContext));
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);

    const fullUserToUser = (user: UserFullType): UserType => {
        let { tenants, ...newUser } = user;
        return (newUser);
    };
    const editUserAction = (id: number): void => {
        if (id === 0) {
            setNewUser(newUserDefault);
            setCurrentUserId(0);
            setCurrentUserTenantId(0);
            editmodeText = 'создание нового';
        } else {
            editmodeText = 'редактирование';
            setCurrentUserId(id);
            const user = users.find(x => x.id === id) as UserFullType;
            setCurrentUserTenantId(user.tenant_id);
            setNewUser(fullUserToUser(user as UserFullType));
        }
        setOpenEditModal(true);
    };
    const copyUserAction = (id: number): void => {
        editmodeText = 'копирование';
        const user = users.find(x => x.id === id) as UserFullType;
        setNewUser({ ...(fullUserToUser(user)), 'id': 0 });
        setCurrentUserTenantId(user.tenant_id);
        setOpenEditModal(true);
    };
    const deleteUserAction = (id: number): void => {
        setShowYesCancelDialog(true);
        setCurrentUserId(id);
        setTimeout(refreshUsers, 300);
    };

    const openDocument: GridEventListener<GridEvents.rowClick> = (
        params, // GridRowParams
        event,  // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {
        // console.log(params);
        // setDocData(params.row as DocDataType);
        //handleOpenModal();
    };

    useGridApiEventHandler(useGridApiRef(), GridEvents.rowClick);

    useEffect(() => {
        if (yesCancel) {
            deleteUser(currentUserId);
            setTimeout(refreshUsers, 300);
            setYesCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUserId, yesCancel]);

    function getTenant(params: GridValueGetterParams<any, any>): string {
        return `${params.row.tenants?.name || ''}`;
    };
    const prodColumns: GridColDef[] = [
        {
            field: 'id', headerName: 'ID', width: 60,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    {params.id}
                </strong>
            ),
        },
        {
            field: 'name',
            headerName: 'User',
            width: 300,
            editable: false,
        },
        {
            field: 'tenant',
            type: 'string',
            headerName: 'Tenant',
            width: 120,
            editable: false,
            valueGetter: getTenant,
        },
        {
            field: 'blocked',
            type: 'boolean',
            headerName: 'Заблокирован',
            width: 90,
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 130,
            editable: false,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    <IconButton size="medium" onClick={() => editUserAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteUserAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyUserAction(params.id as number)}>
                        <ContentCopyIcon />
                    </IconButton>
                </strong>
            ),
        },
    ];

    return (
        <div style={{ height: 630, width: "99%", margin: "50px 4px 4px 4px" }}>
            <TopDocsButtons
                id={0}
                refreshAction={refreshUsers}
                deleteAction={() => { }}
                createNewAction={() => editUserAction(0)}
                copyAction={() => { }}
            />
            <DataGrid rowHeight={32}
                // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                rows={users}
                columns={prodColumns}
                pageSize={16}
                rowsPerPageOptions={[16]}
                checkboxSelection
                disableSelectionOnClick
                onRowClick={(params, event, details) => openDocument(params, event, details)}
            />
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete product (id = ${currentUserId}) ?`}
                modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} editContext={editContext} /> : <></>}
            {openEditModal ? <UserEdit
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}

        </div>
    );
}
