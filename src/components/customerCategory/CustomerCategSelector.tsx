import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCustCategIdState, custCategQuery, custCategsQuery, 
    newCustCategDefault, newCustCategState, 
    openEditModalCustCategState } from './data/customerCategState';
import { openCustCategSelectorState } from './data/customerCategState';
import CustomerCategEdit from './CustomerCategEdit';
import SelectorBodySearch from '../../shared/SelectorBodySearch';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
export const CustCategSelector: React.FC<Props> = ({editContext, enableDruggableParent}) => {
    const dialogHeading = 'Select a Customer Category';
    const [openCustomerCategSelector, setOpenCustomerCategSelector] = useRecoilState(openCustCategSelectorState);
    const items = useRecoilValue(custCategsQuery) as ProductCategoryType[];
    const setCurrentCustomerCategId = useSetRecoilState(currentCustCategIdState(editContext));
    const setEditCustomerCategId = useSetRecoilState(currentCustCategIdState('CustCategSelector'));

    const [openEditModalCustomerCateg, setOpenEditModalCustomerCateg] = useRecoilState(openEditModalCustCategState);
    let customerCategToEdit = useRecoilValue(custCategQuery('CustCategSelector'));
    const [newCustomerCateg, setNewCustomerCateg] = useRecoilState(newCustCategState);


    const openSelector = openCustomerCategSelector;
    const closeSelector = () => {
        setOpenCustomerCategSelector(false);
        enableDruggableParent();
    }

    const takeItem = (id: number) => {
        // console.log('it was take item:' + id);
        setCurrentCustomerCategId(id);        
        setTimeout(() => {
            setOpenCustomerCategSelector(false);
        }, 300);
    };
    // This is copy_paste from CustomerCategGrid 
    // (except using of names: items, setOpenEditModalCustomerCateg), sorry
    const editCustomerCategAction = (id: number) => {
        if (id === 0) {
            setNewCustomerCateg(newCustCategDefault);
            setEditCustomerCategId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setEditCustomerCategId(id);
            const customerCateg = items.find(x => x.id === id) as CustomerCategoryType;
            setNewCustomerCateg(customerCateg);
        }
        setOpenEditModalCustomerCateg(true);
    };
    return (
        <>
            <SelectorBodySearch
                items={items}
                dialogHeading={dialogHeading}
                openSelector={openSelector}
                closeSelector={closeSelector}
                takeItem={takeItem}
                editItem={editCustomerCategAction}
                editContext={editContext}
            />
            {openEditModalCustomerCateg ? <CustomerCategEdit
                modalState={openEditModalCustomerCateg}
                setFromParrent={setOpenEditModalCustomerCateg}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </>
    );
}
