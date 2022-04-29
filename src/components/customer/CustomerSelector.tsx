import * as React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCustomerIdState, customersQuery, newCustomerDefault, newCustomerState, openEditModalCustomerState } from './data/customerState';
import { openCustomerSelectorState } from './data/customerState';
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import CustomerEdit from './CustomerEdit';
import SelectorBodySearch from '../../shared/SelectorBodySearch';

let editmodeText = '';

interface Props {
    editContext: string;
    enableDruggableParent: () => void;
}
export const CustomerSelector: React.FC<Props> = ({ editContext, enableDruggableParent }) => {
    const dialogHeading = 'Select a Customer';
    const [openCustomerSelector, setOpenCustomerSelector] = useRecoilState(openCustomerSelectorState);
    const items = useRecoilValue(customersQuery) as CustomerType[];
    const openSelector = openCustomerSelector;

    const closeSelector = () => {
        setOpenCustomerSelector(false);
        enableDruggableParent();
    }

    const setNewCustomer = useSetRecoilState(newCustomerState);
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState(editContext));
    const setCurrentCustomerCategId = useSetRecoilState(currentCustCategIdState(editContext));
    const [openEditModalCustomer, setOpenEditModalCustomer] = useRecoilState(openEditModalCustomerState);

    // This is copy_paste from CustomersGrid 
    // (except using of names: items, setOpenEditModalCustomer), sorry
    const editCustomerAction = (id: number): void => {
        if (id === 0) {
            setNewCustomer(newCustomerDefault);
            setCurrentCustomerId(0);
            setCurrentCustomerCategId(0);
            editmodeText = 'create new mode';
        } else {
            editmodeText = 'edit mode';
            setCurrentCustomerId(id);
            const customer = items.find(x => x.id === id) as CustomerFullType;
            setNewCustomer(fullCustomerToCustomer(customer));
            setCurrentCustomerCategId(customer.category_id);
        }
        setOpenEditModalCustomer(true);
    };
    const fullCustomerToCustomer = (customer: CustomerFullType): CustomerType => {
        let { customer_categories, ...newCustomer } = customer;
        return (newCustomer);
    };
    const takeItem = (id: number): void => {
        setCurrentCustomerId(id);
        setTimeout(() => {
            setOpenCustomerSelector(false);
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
                editItem={editCustomerAction}
                editContext={editContext}
            />
            {openEditModalCustomer ? <CustomerEdit
                modalState={openEditModalCustomer}
                setFromParrent={setOpenEditModalCustomer}
                editmodeText={editmodeText}
                outerEditContext={editContext}
            /> : <></>}
        </>
    );
}
