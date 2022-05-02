import * as React from 'react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEventListener, GridEvents, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RoleEdit } from './RoleEdit';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { deleteRole } from './data/roleDao';
import { currentRoleIdState, newRoleDefault, newRoleState, rolesFullQuery } from './data/roleState'
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';
import { currentTenantIdState } from '../tenant/data/tenantState';

let editmodeText = '';
let editContext = 'RolesGrid';

export default function RolesGrid(): JSX.Element {

    const roles = useRecoilValue(rolesFullQuery);
    const refreshRoles = useRecoilRefresher_UNSTABLE(rolesFullQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const currentRoleId = useRecoilValue(currentRoleIdState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const setCurrentRoleId = useSetRecoilState(currentRoleIdState(editContext));
    const setNewRole = useSetRecoilState(newRoleState);
    const setCurrentTenantId = useSetRecoilState(currentTenantIdState(editContext));
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);

    const fullRoleToRole = (role: RoleFullType): RoleType => {
        let { tenants, ...newRole } = role;
        return (newRole);
    };
    const editRoleAction = (id: number): void => {
        if (id === 0) {
            setNewRole(newRoleDefault);
            setCurrentRoleId(0);
            setCurrentTenantId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentRoleId(id);
            const role = roles.find(x => x.id === id) as RoleFullType;
            setNewRole(fullRoleToRole(role));
            setCurrentTenantId(role.tenant_id);
        }
        setOpenEditModal(true);
    };
    const copyRoleAction = (id: number): void => {
        editmodeText = 'copy mode';
        const role = roles.find(x => x.id === id) as RoleFullType;
        setNewRole({ ...(fullRoleToRole(role)), 'id': 0 });
        setCurrentTenantId(role.tenant_id);
        setOpenEditModal(true);
    };
    const deleteRoleAction = (id: number): void => {
        setShowYesCancelDialog(true);
        setCurrentRoleId(id);
        setTimeout(refreshRoles, 300);
    };

    // const [docData, setDocData] = React.useState({ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 } as DocDataType);

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
            deleteRole(currentRoleId);
            setTimeout(refreshRoles, 300);
            setYesCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRoleId, yesCancel]);

    function getTenant(params: GridValueGetterParams<any, any>) {
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
            headerName: 'Роль',
            width: 120,
            editable: false,
        },
        {
            field: 'description',
            headerName: 'Описание',
            width: 300,
            editable: false,
        },
        {
            field: 'Tenant',
            type: 'string',
            headerName: 'Tenant',
            width: 120,
            editable: false,
            valueGetter: getTenant,
        },
        {
            field: 'blocked',
            type: 'boolean',
            headerName: 'Заблокирована',
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
                    <IconButton size="medium" onClick={() => editRoleAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteRoleAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyRoleAction(params.id as number)}>
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
                refreshAction={refreshRoles}
                deleteAction={() => { }}
                createNewAction={() => editRoleAction(0)}
                copyAction={() => { }}
            />
            <DataGrid rowHeight={32}
                // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                rows={roles}
                columns={prodColumns}
                pageSize={16}
                rowsPerPageOptions={[16]}
                checkboxSelection
                disableSelectionOnClick
                onRowClick={(params, event, details) => openDocument(params, event, details)}
            />
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Удалить роль (id = ${currentRoleId}) ?`}
                modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} editContext={editContext} /> : <></>}
            {openEditModal ? <RoleEdit
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </div>
    );
}
