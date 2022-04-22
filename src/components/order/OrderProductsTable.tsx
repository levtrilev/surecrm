import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import * as React from 'react';
import PlusOne from '@mui/icons-material/PlusOne';
import { useEffect, useRef, useState } from 'react';
import { newOrderProductsDefault } from './data/orderState';
import { currentProductIdState, newProductDefault, openProductSelectorState, productQuery } from '../product/data/productState';
import { ProductSelector } from '../product/ProductSelector';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import PaperComponentEnabled from '../../shared/PaperComponentEnabled';
import PaperComponentDisabled from '../../shared/PaperComponentDisabled';
import { isModifiedState } from '../../state/state';
import { NewLineKind } from 'typescript';

interface Props {
    orderProducts: OrderProductsFullType[];
    orderProductsEditRef: any;
    orderId: number;
    editContext: string;
}

export const OrderProductsTable: React.FC<Props> = ({ orderProducts, orderProductsEditRef, orderId, editContext }) => {
    const isInitialMountRef = useRef(true);
    const lineIdRef = useRef(0);
    const newLineIdRef = useRef(0);
    const localEditContext = 'Order.' + orderId;
    const paperComponentEnabledRef = useRef(PaperComponentEnabled);
    const paperComponentDisabledRef = useRef(PaperComponentDisabled);
    const paperComponentRef = useRef(PaperComponentEnabled);

    const [orderProductsLines, setOrderProductsLines] = useState([...orderProducts]);
    const [openProductSelector, setOpenProductSelector] = useRecoilState(openProductSelectorState);
    const setIsModified = useSetRecoilState(isModifiedState(localEditContext));

    const currentProduct = useRecoilValue(productQuery(editContext));
    const currentProductId = useRecoilValue(currentProductIdState(editContext));
    const refreshProduct = useRecoilRefresher_UNSTABLE(productQuery(editContext));

    const deleteLineAction = (id: number) => {
        let tmp = [] as OrderProductsFullType[];
        for (let i = 0; i < orderProducts.length; i++) {
            if (orderProducts[i].id !== id) {
                tmp.push(orderProducts[i]);
            }
        }
        orderProductsEditRef.current = tmp;
        setOrderProductsLines(tmp);
        setIsModified(true);
        // debugger;
    }
    const addLineAction = () => {
        let newLine: OrderProductsFullType = { ...newOrderProductsDefault, products: {...newProductDefault, name: "выберите товар"} };
        newLine.order_id = orderId;
        newLine.product_id = 0;
        newLineIdRef.current += 1;
        newLine.id = newLineIdRef.current;
        let tmp = [...orderProductsLines, newLine];
        orderProductsEditRef.current = tmp;
        setOrderProductsLines(tmp);
        setIsModified(true);
    }
    const handleRowEditCommit = React.useCallback(
        (params) => {
            const id = params.id;
            const key = params.field.toString();
            const value = params.value;
            let tmp = orderProductsEditRef.current as OrderProductsFullType[];
            orderProductsEditRef.current = tmp.map(el => el.id === id ? { ...el, [key]: value } : el);
            setOrderProductsLines(orderProductsEditRef.current);
            setIsModified(true);
        },
        []
    );
    const clickOpenProductSelector = (id: number) => {
        setOpenProductSelector(true);
        refreshProduct();
        paperComponentRef.current = paperComponentDisabledRef.current;
        lineIdRef.current = id;
    }
    useEffect(() => {
        if (isInitialMountRef.current) {
            isInitialMountRef.current = false;
        } else {
            let tmp = orderProductsEditRef.current as OrderProductsFullType[];
            orderProductsEditRef.current = tmp.map(el => el.id === lineIdRef.current ? { ...el, product_id: currentProductId, products: currentProduct } : el);
            setOrderProductsLines(orderProductsEditRef.current);
            setIsModified(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProductId]);
    const enableDruggableParent = () => {
        paperComponentRef.current = paperComponentEnabledRef.current;
    };
    function getProductName(params: any) {
        return `${params.row.products?.name || ''}`;
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
            field: 'product',
            headerName: 'Товар',
            width: 180,
            editable: false,
            valueGetter: getProductName,
            renderCell: (params: GridRenderCellParams<number>) => (
                <span onClick={() => clickOpenProductSelector(params.id as number)}>
                    {params.value}
                </span>
            ),
        },
        {
            field: 'product_id',
            type: 'number',
            headerName: 'ID товара',
            width: 90,
            editable: false,
        },
        {
            field: 'quantity',
            type: 'number',
            headerName: 'Колич',
            width: 75,
            editable: true,
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
                        {`Спецификация заказа:`}
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
                    rows={orderProductsLines}
                    columns={prodColumns}
                    rowHeight={32}
                    pageSize={8}
                    rowsPerPageOptions={[8]}
                    onCellEditCommit={handleRowEditCommit}
                />
            </div>
            {openProductSelector ? <ProductSelector editContext={editContext} enableDruggableParent={enableDruggableParent} /> : <></>}
        </>
    );
}