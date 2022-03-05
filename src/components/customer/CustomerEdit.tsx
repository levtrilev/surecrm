import * as React from 'react';
import { postNewCustomer, putUpdatedCustomer } from './data/customerDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { newCustomerState, customersFullQuery, customerQuery } from './data/customerState'
import { currentCustomerCategIdState, openCustomerCategSelectorState } from '../customerCateg/data/customerCategState';
import { useEffect } from 'react';
import { CustomerCategSelector } from '../customerCateg/CustomerCategSelector';
import { CustomerEditForm } from './CustomerEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    customer: CustomerType;
    editmodeText: string;
}

export const CustomerEdit: React.FC<Props> = ({ customer, modalState, setFromParrent, editmodeText }) => {
    const [newCustomer, setNewCustomer] = useRecoilState(newCustomerState);
    const refreshCustomers = useRecoilRefresher_UNSTABLE(customersFullQuery);
    const setOpenCustomerCategSelector = useSetRecoilState(openCustomerCategSelectorState);
    const currentCustomerCategId = useRecoilValue(currentCustomerCategIdState);
    const refreshCustomer = useRecoilRefresher_UNSTABLE(customerQuery);

    const handleClose = () => {
        setFromParrent(false);
    };

    const updateCustomer = (customer: CustomerType) => {
        if (customer.id === 0) {
            postNewCustomer(customer);
        } else {
            putUpdatedCustomer(customer);
        }
        setTimeout(refreshCustomers, 300);
        setTimeout(refreshCustomer, 300);
    };
    useEffect(() => {
        setNewCustomer({ ...newCustomer, 'category_id': currentCustomerCategId });
        // console.log('useEffect fired!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCustomerCategId]);
    return (
        <div>
            <CustomerEditForm
                customer={customer}
                updateCustomer={updateCustomer}
                setOpenCustomerCategSelector={setOpenCustomerCategSelector}
                CustomerCategSelector={CustomerCategSelector}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
            />
        </div>
    );
}

export default CustomerEdit;
