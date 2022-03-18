import * as React from 'react';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEventListener, GridEvents, GridRenderCellParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { OrderEdit } from './OrderEdit';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { deleteOrder } from './data/orderDao';
import { currentOrderIdState, newOrderDefault, newOrderState, orderQuery, ordersFullQuery } from './data/orderState'
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';
import { currentCustomerIdState } from '../customer/data/customerState';

let editmodeText = '';
let editContext = 'OrdersGrid';

export default function OrdersGrid() {

    const orders = useRecoilValue(ordersFullQuery) as OrderFullType[];
    const refreshOrders = useRecoilRefresher_UNSTABLE(ordersFullQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const currentOrderId = useRecoilValue(currentOrderIdState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const setCurrentOrderId = useSetRecoilState(currentOrderIdState(editContext));
    let orderToOpen = useRecoilValue(orderQuery(editContext));
    const setNewOrder = useSetRecoilState(newOrderState);
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState(editContext));

    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);
    const newOrder = useRecoilValue(newOrderState);

    const fullOrderToOrder = (order: OrderFullType) => {
        // removes customers
        // to transform orderFullType to orderType
        let { customers, ...newOrder } = order;
        return (newOrder);
    };
    const editOrderAction = (id: number) => {
        if (id === 0) {
            setNewOrder(newOrderDefault);
            setCurrentOrderId(0);
            setCurrentCustomerId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentOrderId(id);
            const order = orders.find(x => x.id === id) as OrderFullType;
            setNewOrder(fullOrderToOrder(order));
            setCurrentCustomerId(order.customer_id);
        }
        setOpenEditModal(true);
    };
    const copyOrderAction = (id: number) => {
        editmodeText = 'copy mode';
        const order = orders.find(x => x.id === id) as OrderFullType;
        setNewOrder({ ...(fullOrderToOrder(order)), 'id': 0 });
        setCurrentCustomerId(order.customer_id);
        setOpenEditModal(true);
    };
    const deleteOrderAction = (id: number) => {
        setShowYesCancelDialog(true);
        setCurrentOrderId(id);
        setTimeout(refreshOrders, 300);
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
            deleteOrder(currentOrderId);
            setTimeout(refreshOrders, 300);
            setYesCancel(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentOrderId, yesCancel]);

    function getCustomer(params: any) {
        return `${params.row.customers?.name || ''}`;
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
            headerName: 'Order name',
            width: 300,
            editable: false,
        },
        {
            field: 'customer',
            type: 'string',
            headerName: 'Customer',
            width: 120,
            editable: false,
            valueGetter: getCustomer,
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
                    <IconButton size="medium" onClick={() => editOrderAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteOrderAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyOrderAction(params.id as number)}>
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
                refreshAction={refreshOrders}
                deleteAction={() => { }}
                createNewAction={() => editOrderAction(0)}
                copyAction={() => { }}
            />
            <DataGrid rowHeight={32}
                // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                rows={orders}
                columns={prodColumns}
                pageSize={16}
                rowsPerPageOptions={[16]}
                checkboxSelection
                disableSelectionOnClick
                onRowClick={(params, event, details) => openDocument(params, event, details)}
            />
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete product (id = ${orderToOpen.id}) ?`}
                modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} editContext={editContext}/> : <></>}
            {openEditModal ? <OrderEdit
                order={orderToOpen ? orderToOpen : newOrder}
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}

        </div>
    );
}
