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
import { currentCustomerCategIdState, customerCategQuery, customerCategsQuery, newCustomerCategDefault, newCustomerCategState } from './data/customerCategState';
import { deleteCustomerCateg } from './data/customerCategDao';
import CustomerCategEdit from './CustomerCategEdit';

let editmodeText = '';

export default function CustomerCategGrid() {

    const customerCategs = useRecoilValue(customerCategsQuery) as CustomerCategoryType[];
    const refreshCustomerCategs = useRecoilRefresher_UNSTABLE(customerCategsQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState);
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState);
    const [currentCustomerCategId, setCurrentCustomerCategId] = useRecoilState(currentCustomerCategIdState);
    let customerCategToOpen = useRecoilValue(customerCategQuery);
    const setNewCustomerCateg = useSetRecoilState(newCustomerCategState);

    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    const newCustomerCateg = useRecoilValue(newCustomerCategState);

    // const fullProductToProduct = (product: ProductFullType) => {
    //     let { product_categories, ...newProduct } = product;
    //     return (newProduct);
    // };
    const editCustomerCategAction = (id: number) => {
        if (id === 0) {
            setNewCustomerCateg(newCustomerCategDefault);
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
    // function getCategory(params: any) {
    //     return `${params.row.product_categories.name || ''}`;
    // }
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
            headerName: 'Category name',
            width: 300,
            editable: false,
        },
        // {
        //     field: 'blocked',
        //     type: 'boolean',
        //     headerName: 'Blocked',
        //     width: 90,
        //     editable: false,
        // },
        {
            field: 'actions',
            headerName: 'Actions',
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
                {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete category (id = ${customerCategToOpen.id}) ?`} modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} /> : <></>}
                {openEditModal ? <CustomerCategEdit
                    customerCateg={customerCategToOpen ? customerCategToOpen : newCustomerCateg}
                    modalState={openEditModal}
                    setFromParrent={setOpenEditModal}
                    editmodeText={editmodeText}
                /> : <></>}

            </div>
        </>
    );
}
