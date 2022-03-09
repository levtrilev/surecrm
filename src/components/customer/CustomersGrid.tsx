import * as React from 'react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEventListener, GridEvents, GridRenderCellParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CustomerEdit } from './CustomerEdit';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { deleteCustomer } from './data/customerDao';
import { currentCustomerIdState, newCustomerDefault, newCustomerState, customerQuery, customersFullQuery } from './data/customerState'
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';

let editmodeText = '';
const editContext = 'CustomersGrid';

export default function CustomersGrid() {

    const customers = useRecoilValue(customersFullQuery) as CustomerFullType[];
    const refreshCustomers = useRecoilRefresher_UNSTABLE(customersFullQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const currentCustomerId = useRecoilValue(currentCustomerIdState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState(editContext));
    let customerToOpen = useRecoilValue(customerQuery(editContext));
    const setNewCustomer = useSetRecoilState(newCustomerState);
    const setCurrentCustomerCategId = useSetRecoilState(currentCustCategIdState(editContext));
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    const newCustomer = useRecoilValue(newCustomerState);

    const fullCustomerToCustomer = (customer: CustomerFullType) => {
        // removes customer_categories
        // to transform customerFullType to customerType
        let { customer_categories, ...newCustomer } = customer;
        return (newCustomer);
    };
    const editCustomerAction = (id: number) => {
        if (id === 0) {
            setNewCustomer(newCustomerDefault);
            setCurrentCustomerId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentCustomerId(id);
            const customer = customers.find(x => x.id === id) as CustomerFullType;
            setNewCustomer(fullCustomerToCustomer(customer));
        }
        setOpenEditModal(true);
    };
    const copyCustomerAction = (id: number) => {
        editmodeText = 'copy mode';
        const customer = customers.find(x => x.id === id) as CustomerFullType;
        setNewCustomer({ ...(customer), 'id': 0 });
        setCurrentCustomerCategId(customer.category_id);
        setOpenEditModal(true);
    };
    const deleteCustomerAction = (id: number) => {
        setShowYesCancelDialog(true);
        setCurrentCustomerId(id);
        setTimeout(refreshCustomers, 300);
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
            deleteCustomer(currentCustomerId);
            setTimeout(refreshCustomers, 300);
            setYesCancel(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCustomerId, yesCancel]);

    function getCategory(params: any) {
        return `${params.row.customer_categories?.name || ''}`;
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
            headerName: 'Customer name',
            width: 300,
            editable: false,
        },
        {
            field: 'category',
            type: 'string',
            headerName: 'Category',
            width: 120,
            editable: false,
            valueGetter: getCategory,
        },
        {
            field: 'blocked',
            type: 'boolean',
            headerName: 'Blocked',
            width: 90,
            editable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 130,
            editable: false,
            renderCell: (params: GridRenderCellParams<number>) => (
                <strong>
                    <IconButton size="medium" onClick={() => editCustomerAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteCustomerAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyCustomerAction(params.id as number)}>
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
                refreshAction={refreshCustomers}
                deleteAction={() => { }}
                createNewAction={() => editCustomerAction(0)}
                copyAction={() => { }}
            />
            <DataGrid rowHeight={32}
                // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                rows={customers}
                columns={prodColumns}
                pageSize={16}
                rowsPerPageOptions={[16]}
                checkboxSelection
                disableSelectionOnClick
                onRowClick={(params, event, details) => openDocument(params, event, details)}
            />
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete product (id = ${customerToOpen.id}) ?`}
                modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} editContext={editContext}/> : <></>}
            {openEditModal ? <CustomerEdit
                customer={customerToOpen ? customerToOpen : newCustomer}
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}

        </div>
    );
}
