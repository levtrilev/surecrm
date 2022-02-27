import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCustomerIdState, customersQuery } from './data/customerState';
import { openCustomerSelectorState } from './data/customerState';
import SelectorBody from '../../shared/SelectorBody';

export function CustomerSelecor() {
    const dialogHeading = 'Select a Customer';
    const [openCustomerSelector, setOpenCustomerSelector] = useRecoilState(openCustomerSelectorState);
    const items = useRecoilValue(customersQuery) as CustomerType[];
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState);
    const openSelector = openCustomerSelector;
    const closeSelector = () => setOpenCustomerSelector(false);
    const takeItem = (id: number) => {
        setCurrentCustomerId(id);
        setTimeout(() => {
            setOpenCustomerSelector(false);
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
