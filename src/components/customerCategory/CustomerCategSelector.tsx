import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCustomerCategIdState, customerCategsQuery } from './customerCategoriesState';
import { openCustomerCategSelectorState } from './customerCategoriesState';
import SelectorBody from '../../shared/SelectorBody';

export function CustomerCategSelector() {
    const dialogHeading = 'Select a Customer Category';
    const [openCustomerCategSelector, setOpenCustomerCategSelector] = useRecoilState(openCustomerCategSelectorState);
    const items = useRecoilValue(customerCategsQuery) as ProductCategoryType[];
    const setCurrentProdCategId = useSetRecoilState(currentCustomerCategIdState);
    const openSelector = openCustomerCategSelector;
    const closeSelector = () => setOpenCustomerCategSelector(false);
    const takeItem = (id: number) => {
        setCurrentProdCategId(id);
        setTimeout(() => {
            setOpenCustomerCategSelector(false);
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
