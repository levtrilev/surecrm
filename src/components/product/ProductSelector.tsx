import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProductIdState, productsQuery, newProductDefault, newProductState, openEditModalProductState } from './data/productState';
import { openProductSelectorState } from './data/productState';
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import ProductEdit from './ProductEdit';
import SelectorBodySearch from '../../shared/SelectorBodySearch';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
    export const ProductSelector: React.FC<Props> = ({editContext, enableDruggableParent}) => {
        const dialogHeading = 'Выберите товар';
    const [openProductSelector, setOpenProductSelector] = useRecoilState(openProductSelectorState);
    const items = useRecoilValue(productsQuery) as ProductType[];
    const openSelector = openProductSelector;

    const closeSelector = () => {
        setOpenProductSelector(false);
        enableDruggableParent();
    }

    const setNewProduct = useSetRecoilState(newProductState);
    const setCurrentProductId = useSetRecoilState(currentProductIdState(editContext));
    const setCurrentProductCategId = useSetRecoilState(currentCustCategIdState(editContext));
    const [openEditModalProduct, setOpenEditModalProduct] = useRecoilState(openEditModalProductState);

    // This is copy_paste from ProductsGrid 
    // (except using of names: items, setOpenEditModalProduct), sorry
    const editProductAction = (id: number) => {
        if (id === 0) {
            setNewProduct(newProductDefault);
            setCurrentProductId(0);
            setCurrentProductCategId(0);
            editmodeText = 'создание';
        } else {
            editmodeText = 'редактирование';
            setCurrentProductId(id);
            const product = items.find(x => x.id === id) as ProductFullType;
            setNewProduct(fullProductToProduct(product));
            setCurrentProductCategId(product.category_id);
        }
        setOpenEditModalProduct(true);
    };
    // This is copy_paste from ProductsGrid
    const fullProductToProduct = (product: ProductFullType) => {
        let { product_categories, ...newProduct } = product;
        return (newProduct);
    };
    const takeItem = (id: number) => {
        setCurrentProductId(id);
        setTimeout(() => {
            setOpenProductSelector(false);
        }, 300);
    }
    return (
        <>
            <SelectorBodySearch
                items={items}
                dialogHeading={dialogHeading}
                openSelector={openSelector}
                closeSelector={closeSelector}
                takeItem={takeItem}
                editItem={editProductAction}
                editContext={editContext}
            />
            {openEditModalProduct ? <ProductEdit
                modalState={openEditModalProduct}
                setFromParrent={setOpenEditModalProduct}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </>
    );
}
