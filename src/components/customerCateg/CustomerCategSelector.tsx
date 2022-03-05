import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCustomerCategIdState, customerCategQuery, customerCategsQuery, 
    newCustomerCategDefault, newCustomerCategState, 
    openEditModalCustomerCategState } from './data/customerCategState';
import { openCustomerCategSelectorState } from './data/customerCategState';
import SelectorBody from '../../shared/SelectorBody';
import CustomerCategEdit from './CustomerCategEdit';

let editmodeText = '';

export function CustomerCategSelector() {
    const dialogHeading = 'Select a Customer Category';
    const [openCustomerCategSelector, setOpenCustomerCategSelector] = useRecoilState(openCustomerCategSelectorState);
    const items = useRecoilValue(customerCategsQuery) as ProductCategoryType[];
    const setCurrentProdCategId = useSetRecoilState(currentCustomerCategIdState);
    
    const [openEditModalCustomerCateg, setOpenEditModalCustomerCateg] = useRecoilState(openEditModalCustomerCategState);
    let customerCategToOpen = useRecoilValue(customerCategQuery);
    const [newCustomerCateg, setNewCustomerCateg] = useRecoilState(newCustomerCategState);
    const setCurrentCustomerCategId = useSetRecoilState(currentCustomerCategIdState);


    const openSelector = openCustomerCategSelector;
    const closeSelector = () => setOpenCustomerCategSelector(false);

    const takeItem = (id: number) => {
        console.log('it was a single click!');
        setCurrentProdCategId(id);        
        setTimeout(() => {
            setOpenCustomerCategSelector(false);
        }, 300);
    };
    // This is copy_paste from CustomerCategGrid 
    // (except using of names: items, setOpenEditModalCustomerCateg), sorry
    const editCustomerCategAction = (id: number) => {
        if (id === 0) {
            setNewCustomerCateg(newCustomerCategDefault);
            setCurrentCustomerCategId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentCustomerCategId(id);
            const customerCateg = items.find(x => x.id === id) as CustomerCategoryType;
            setNewCustomerCateg(customerCateg);
        }
        setOpenEditModalCustomerCateg(true);
    };
    return (
        <>
            <SelectorBody
                items={items}
                dialogHeading={dialogHeading}
                openSelector={openSelector}
                closeSelector={closeSelector}
                // itemClickHandle={itemClickHandle}
                takeItem={takeItem}
                editItem={editCustomerCategAction}
            />
            {openEditModalCustomerCateg ? <CustomerCategEdit
                customerCateg={customerCategToOpen ? customerCategToOpen : newCustomerCateg}
                modalState={openEditModalCustomerCateg}
                setFromParrent={setOpenEditModalCustomerCateg}
                editmodeText={editmodeText}
            /> : <></>}
        </>
    );
}
