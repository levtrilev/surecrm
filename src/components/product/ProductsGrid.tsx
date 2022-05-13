import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil';
import { DataGrid, GridColDef, GridEventListener, GridEvents, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { useGridApiRef, useGridApiEventHandler } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ProductEdit } from './ProductEdit';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { deleteProduct } from './data/productDao';
import { useEffect, useRef } from 'react';
import { currentProductIdState, newProductDefault, newProductState, productsFullQuery } from './data/productState'
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state'
import { currentProdCategIdState } from '../productCategory/data/prodCategState';
import TopDocsButtons from '../../shared/navigation/TopDocsButtons';

let editmodeText = '';
const editContext = 'ProductsGrid';

export default function ProductsGrid(): JSX.Element {

    const isInitialMount = useRef(true);
    const products = useRecoilValue(productsFullQuery) as ProductFullType[];
    const refreshProducts = useRecoilRefresher_UNSTABLE(productsFullQuery);
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const [currentProductId, setCurrentProductId] = useRecoilState(currentProductIdState(editContext));
    const setNewProduct = useSetRecoilState(newProductState);
    const setCurrentProdCategId = useSetRecoilState(currentProdCategIdState(editContext));
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);

    const fullProductToProduct = (product: ProductFullType): ProductType => {
        // removes product_categories
        // to transform productFullType to productType
        let { product_categories, ...newProduct } = product;
        return (newProduct);
    };
    const editProductAction = (id: number): void => {
        if (id === 0) {
            setNewProduct(newProductDefault);
            setCurrentProductId(0);
            setCurrentProdCategId(0);
            editmodeText = 'создание нового';
        } else {
            editmodeText = 'редактирование';
            setCurrentProductId(id);
            const product = products.find(x => x.id === id) as ProductFullType;
            setNewProduct(fullProductToProduct(product));
            setCurrentProdCategId(product.category_id);
        }
        setOpenEditModal(true);
    };
    const copyProductAction = (id: number): void => {
        editmodeText = 'копирование';
        const product = products.find(x => x.id === id) as ProductFullType;
        setNewProduct({ ...(fullProductToProduct(product)), 'id': 0 });
        setCurrentProductId(0);
        setCurrentProdCategId(product.category_id);
        setOpenEditModal(true);
    };
    const deleteProductAction = (id: number): void => {
        setShowYesCancelDialog(true);
        setCurrentProductId(id);
        setTimeout(refreshProducts, 300);
    };
    function getCategory(params: GridValueGetterParams<any, any>): string {
        return `${params.row.product_categories.name || ''}`;
    }
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
            headerName: 'Товар',
            width: 300,
            editable: false,
        },
        {
            field: 'category',
            type: 'string',
            headerName: 'Категория',
            width: 120,
            editable: false,
            valueGetter: getCategory,
        },
        {
            field: 'base_price',
            type: 'number',
            headerName: 'Цена',
            width: 100,
            editable: false,
        },
        {
            field: 'vat',
            type: 'number',
            headerName: 'НДС,%',
            width: 80,
            editable: false,
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
                    <IconButton size="medium" onClick={() => editProductAction(params.id as number)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="medium" onClick={() => deleteProductAction(params.id as number)}>
                        <DeleteOutline />
                    </IconButton>
                    <IconButton size="medium" onClick={() => copyProductAction(params.id as number)}>
                        <ContentCopyIcon />
                    </IconButton>
                </strong>
            ),
        },
    ];

    const [docData, setDocData] = React.useState({ id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 } as DocDataType);

    const openDocument: GridEventListener<GridEvents.rowClick> = (
        params, // GridRowParams
        event,  // MuiEvent<React.MouseEvent<HTMLElement>>
        details, // GridCallbackDetails
    ) => {

        setDocData(params.row as DocDataType);
        //handleOpenModal();
    }
    useGridApiEventHandler(useGridApiRef(), GridEvents.rowClick);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setTimeout(() => {
                refreshProducts();
            }, 200);
        }
    }, [refreshProducts]);
    useEffect(() => {
        if (yesCancel) {
            deleteProduct(currentProductId);
            setTimeout(refreshProducts, 300);
            setYesCancel(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProductId, yesCancel]);

    return (
        <>
            <div style={{ height: 630, width: "99%", margin: "50px 4px 4px 4px" }}>
                <TopDocsButtons
                    id={0}
                    refreshAction={refreshProducts}
                    deleteAction={() => { }}
                    createNewAction={() => editProductAction(0)}
                    copyAction={() => { }}
                />
                <DataGrid rowHeight={32}
                    // rows={[...products, { id: 100, name: 'Snow', blocked: true }]}
                    rows={products}
                    columns={prodColumns}
                    pageSize={16}
                    rowsPerPageOptions={[16]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowClick={(params, event, details) => openDocument(params, event, details)}
                />
                {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete product (id = ${currentProductId}) ?`}
                    modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} editContext={editContext} /> : <></>}
                {openEditModal ? <ProductEdit
                    modalState={openEditModal}
                    setFromParrent={setOpenEditModal}
                    editmodeText={editmodeText}
                    outerEditContext={editContext}
                    /> : <></>}
            </div>
        </>
    );
}
