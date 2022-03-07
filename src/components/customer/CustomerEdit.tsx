import * as React from 'react';
import { postNewCustomer, putUpdatedCustomer } from './data/customerDao';
import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { newCustomerState, customersFullQuery, customerQuery } from './data/customerState'
import { currentCustCategIdState } from '../customerCategory/data/customerCategState';
import { useEffect } from 'react';
import { CustomerEditForm } from './CustomerEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    customer: CustomerType;
    editmodeText: string;
}

export const CustomerEdit: React.FC<Props> = ({ customer, modalState, setFromParrent, editmodeText }) => {
    const editContext = 'cust.' + customer.id;

    const [newCustomer, setNewCustomer] = useRecoilState(newCustomerState);
    const refreshCustomers = useRecoilRefresher_UNSTABLE(customersFullQuery);
    const [currentCustomerCategId, setCurrentCustomerCategId] = useRecoilState(currentCustCategIdState(editContext));
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
    if (currentCustomerCategId === 0) {
        setCurrentCustomerCategId(customer.category_id);
    }
        setNewCustomer({ ...newCustomer, 'category_id': currentCustomerCategId });
        // console.log('useEffect fired!');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCustomerCategId]);
    return (
        <div>
            <CustomerEditForm
                customer={customer}
                updateCustomer={updateCustomer}
                handleClose={handleClose}
                modalState={modalState}
                editmodeText={editmodeText}
            />
        </div>
    );
}

export default CustomerEdit;
