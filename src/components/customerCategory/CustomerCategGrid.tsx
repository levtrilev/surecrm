// это пока загрлушка
import * as React from 'react';
import { useEffect, useRef } from 'react';
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
import { currentCustCategIdState, custCategsQuery, newCustCategDefault, newCustCategState } from './data/customerCategState';
import { deleteCustomerCateg } from './data/customerCategDao';
import CustomerCategEdit from './CustomerCategEdit';

let editmodeText = '';
let editContext = 'CustCategGrid';

export default function CustCategGrid() {

    const isInitialMount = useRef(true);
    const customerCategs = useRecoilValue(custCategsQuery) as CustomerCategoryType[];
    const refreshCustomerCategs = useRecoilRefresher_UNSTABLE(custCategsQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const [currentCustomerCategId, setCurrentCustomerCategId] = useRecoilState(currentCustCategIdState(editContext));
    // let customerCategToOpen = useRecoilValue(custCategQuery(editContext));
    const setNewCustomerCateg = useSetRecoilState(newCustCategState);

    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    // const newCustomerCateg = useRecoilValue(newCustCategState);

    const editCustomerCategAction = (id: number) => {
        if (id === 0) {
            setNewCustomerCateg(newCustCategDefault);
            setCurrentCustomerCategId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentCustomerCategId(id);
            const customerCateg = customerCategs.find(x => x.id === id) as CustomerCategoryType;
            setNewCustomerCateg(customerCateg);
        }
        setOpenEditModal(true);
    };
    const copyCustomerCategAction = (id: number) => {
        editmodeText = 'copy mode';
        const customerCateg = customerCategs.find(x => x.id === id) as CustomerCategoryType;
        setNewCustomerCateg({ ...customerCateg, 'id': 0 });
        setOpenEditModal(true);
    };
    const deleteCustomerCategAction = (id: number) => {
        setShowYesCancelDialog(true);
        setCurrentCustomerCategId(id);
        setTimeout(refreshCustomerCategs, 300);
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
                    <IconButton size="medium" onClick={() => editCustomerCategAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteCustomerCategAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyCustomerCategAction(params.id as number)}>
                        <ContentCopyIcon />
                    </IconButton>
                </strong>
            ),
        },
    ];

    useGridApiEventHandler(useGridApiRef(), GridEvents.rowClick);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setTimeout(() => {
                refreshCustomerCategs();
            }, 200);
        }
    }, [refreshCustomerCategs]);

    useEffect(() => {
        if (yesCancel) {
            deleteCustomerCateg(currentCustomerCategId);
            setTimeout(refreshCustomerCategs, 300);
            setYesCancel(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCustomerCategId, yesCancel]);

    return (
        <>
            <div style={{ height: 630, width: "99%", margin: "50px 4px 4px 4px" }}>
                <TopDocsButtons
                    id={0}
                    refreshAction={refreshCustomerCategs}
                    deleteAction={() => { }}
                    createNewAction={() => editCustomerCategAction(0)}
                    copyAction={() => { }}
                />
                <DataGrid rowHeight={32}
                    // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                    rows={customerCategs}
                    columns={prodColumns}
                    pageSize={16}
                    rowsPerPageOptions={[16]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowClick={(params, event, details) => {}}
                />
                {showYesCancelDialog ? <YesCancelDialog
                    questionToConfirm={`Delete category (id = ${currentCustomerCategId}) ?`}
                    modalState={showYesCancelDialog}
                    setFromParrent={setShowYesCancelDialog}
                    editContext={editContext}
                /> : <></>}
                {openEditModal ? <CustomerCategEdit
                    modalState={openEditModal}
                    setFromParrent={setOpenEditModal}
                    editmodeText={editmodeText}
                    outerEditContext={editContext}
                /> : <></>}

            </div>
        </>
    );
}
