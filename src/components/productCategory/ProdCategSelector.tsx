import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProdCategIdState, currentProdCategState, prodCategsQuery } from './productCategoriesState';
import { openProdCategSelectorState } from './productCategoriesState';
import SelectorBody from '../../shared/SelectorBody';

export function ProdCategSelector() {
    const dialogHeading = 'Select a Product Category';
    const [openProdCategSelector, setOpenProdCategSelector] = useRecoilState(openProdCategSelectorState);
    const items = useRecoilValue(prodCategsQuery) as ProductCategoryType[];
    const setCurrentProdCategId = useSetRecoilState(currentProdCategIdState);
    const setCurrentProdCateg = useSetRecoilState(currentProdCategState);
    const openSelector = openProdCategSelector;
    const closeSelector = () => setOpenProdCategSelector(false);
    const takeItem = (id: number) => {
        setCurrentProdCategId(id);
        const item = items.find(x => x.id === id) as ProductCategoryType;
        setCurrentProdCateg(item);
        setTimeout(() => {
            setOpenProdCategSelector(false);
        }, 300);
    }
    return (
        <SelectorBody 
        items = {items}
        dialogHeading = {dialogHeading}
        openSelector = {openSelector}
        closeSelector = {closeSelector}
        takeItem = {takeItem}
        />
    );
}
