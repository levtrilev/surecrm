// это пока загрлушка
import * as React from 'react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEvents, GridRenderCellParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';
import { currentTenantIdState, tenantsQuery, newTenantDefault, newTenantState } from './data/tenantState';
import { deleteTenant } from './data/tenantDao';
import TenantEdit from './TenantEdit';

let editmodeText = '';
let editContext = 'TenantGrid';

export default function TenantsGrid() {

    const tenants = useRecoilValue(tenantsQuery);
    const refreshTenants = useRecoilRefresher_UNSTABLE(tenantsQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const [currentTenantId, setCurrentTenantId] = useRecoilState(currentTenantIdState(editContext));
    const setNewTenant = useSetRecoilState(newTenantState);

    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);

    const editTenantAction = (id: number) => {
        if (id === 0) {
            setNewTenant(newTenantDefault);
            setCurrentTenantId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentTenantId(id);
            const tenant = tenants.find(x => x.id === id) as TenantType;
            setNewTenant(tenant);
        }
        setOpenEditModal(true);
    };
    const copyTenantAction = (id: number) => {
        editmodeText = 'copy mode';
        const tenant = tenants.find(x => x.id === id) as TenantType;
        setNewTenant({ ...tenant, 'id': 0 });
        setOpenEditModal(true);
    };
    const deleteTenantAction = (id: number) => {
        setShowYesCancelDialog(true);
        setCurrentTenantId(id);
        setTimeout(refreshTenants, 300);
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
            headerName: 'Tenant',
            width: 300,
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Действия',
            width: 130,
            editable: false,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    <IconButton size="medium" onClick={() => editTenantAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteTenantAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyTenantAction(params.id as number)}>
                        <ContentCopyIcon />
                    </IconButton>
                </strong>
            ),
        },
    ];

    useGridApiEventHandler(useGridApiRef(), GridEvents.rowClick);

    useEffect(() => {
        if (yesCancel) {
            deleteTenant(currentTenantId);
            setTimeout(refreshTenants, 300);
            setYesCancel(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTenantId, yesCancel]);

    return (
        <>
            <div style={{ height: 630, width: "99%", margin: "50px 4px 4px 4px" }}>
                <TopDocsButtons
                    id={0}
                    refreshAction={refreshTenants}
                    deleteAction={() => { }}
                    createNewAction={() => editTenantAction(0)}
                    copyAction={() => { }}
                />
                <DataGrid rowHeight={32}
                    // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                    rows={tenants}
                    columns={prodColumns}
                    pageSize={16}
                    rowsPerPageOptions={[16]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowClick={(params, event, details) => {}}
                />
                {showYesCancelDialog ? <YesCancelDialog
                    questionToConfirm={`Delete tenant (id = ${currentTenantId}) ?`}
                    modalState={showYesCancelDialog}
                    setFromParrent={setShowYesCancelDialog}
                    editContext={editContext}
                /> : <></>}
                {openEditModal ? <TenantEdit
                    modalState={openEditModal}
                    setFromParrent={setOpenEditModal}
                    editmodeText={editmodeText}
                    outerEditContext={editContext}
                /> : <></>}

            </div>
        </>
    );
}
