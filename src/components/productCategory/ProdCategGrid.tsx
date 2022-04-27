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
import {
    currentProdCategIdState, prodCategQuery, prodCategsQuery,
    newProdCategDefault, newProdCategState
} from './data/prodCategState';
import { deleteProdCateg } from './data/prodCategDao';
import ProdCategEdit from './ProdCategEdit';

let editmodeText = '';
let editContext = 'ProdCategGrid';

export default function ProdCategGrid() {

    const prodCategs = useRecoilValue(prodCategsQuery) as ProductCategoryType[];
    const refreshProdCategs = useRecoilRefresher_UNSTABLE(prodCategsQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const [currentProdCategId, setCurrentProdCategId] = useRecoilState(currentProdCategIdState(editContext));
    let prodCategToOpen = useRecoilValue(prodCategQuery(editContext));
    const setNewProdCateg = useSetRecoilState(newProdCategState);

    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    // const newProdCateg = useRecoilValue(newProdCategState);

    const editProdCategAction = (id: number) => {
        if (id === 0) {
            setNewProdCateg(newProdCategDefault);
            setCurrentProdCategId(0);
            editmodeText = 'создание нового';
        } else {
            editmodeText = 'редактирование';
            setCurrentProdCategId(id);
            const prodCateg = prodCategs.find(x => x.id === id) as ProductCategoryType;
            setNewProdCateg(prodCateg);
        }
        setOpenEditModal(true);
    };

    const copyProdCategAction = (id: number) => {
        editmodeText = 'копирование';
        const prodCateg = prodCategs.find(x => x.id === id) as ProductCategoryType;
        setNewProdCateg({ ...prodCateg, 'id': 0 });
        setOpenEditModal(true);
    };
    const deleteProdCategAction = (id: number) => {
        setShowYesCancelDialog(true);
        setCurrentProdCategId(id);
        setTimeout(refreshProdCategs, 300);
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
            headerName: 'Категория',
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
                    <IconButton size="medium" onClick={() => editProdCategAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteProdCategAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyProdCategAction(params.id as number)}>
                        <ContentCopyIcon />
                    </IconButton>
                </strong>
            ),
        },
    ];

    useGridApiEventHandler(useGridApiRef(), GridEvents.rowClick);

    useEffect(() => {
        if (yesCancel) {
            deleteProdCateg(currentProdCategId);
            setTimeout(refreshProdCategs, 300);
            setYesCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProdCategId, yesCancel]);

    return (
        <>
            <div style={{ height: 630, width: "99%", margin: "50px 4px 4px 4px" }}>
                <TopDocsButtons
                    id={0}
                    refreshAction={refreshProdCategs}
                    deleteAction={() => { }}
                    createNewAction={() => editProdCategAction(0)}
                    copyAction={() => { }}
                />
                <DataGrid rowHeight={32}
                    // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                    rows={prodCategs}
                    columns={prodColumns}
                    pageSize={16}
                    rowsPerPageOptions={[16]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowClick={(params, event, details) => { }}
                />
                {showYesCancelDialog ? <YesCancelDialog
                    questionToConfirm={`Delete category (id = ${prodCategToOpen.id}) ?`}
                    modalState={showYesCancelDialog}
                    setFromParrent={setShowYesCancelDialog}
                    editContext={editContext}
                /> : <></>}
                {openEditModal ? <ProdCategEdit
                    modalState={openEditModal}
                    setFromParrent={setOpenEditModal}
                    editmodeText={editmodeText}
                    outerEditContext={editContext}
                /> : <></>}
            </div>
        </>
    );
}
