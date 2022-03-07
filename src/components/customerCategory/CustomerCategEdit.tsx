import * as React from 'react';
import { putUpdatedCustomerCateg, postNewCustomerCateg } from './data/customerCategDao';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { custCategQuery, custCategsQuery } from './data/customerCategState'
import { CustomerCategEditForm } from './CustomerCategEditForm';

interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    customerCateg: CustomerCategoryType;
    editmodeText: string;
    editContext: string;
}

export const CustomerCategEdit: React.FC<Props> = ({ customerCateg, modalState, setFromParrent, editmodeText, editContext }) => {
    const refreshCustomerCategs = useRecoilRefresher_UNSTABLE(custCategsQuery);
    const refreshCustomerCateg = useRecoilRefresher_UNSTABLE(custCategQuery(editContext));
    
    const handleClose = () => {
        setFromParrent(false);
    };

    const updateCustomerCateg = (customerCateg: CustomerCategoryType) => {
        if (customerCateg.id === 0) {
            postNewCustomerCateg(customerCateg);
        } else {
            putUpdatedCustomerCateg(customerCateg);
        }
        setTimeout(refreshCustomerCategs, 300);
        setTimeout(refreshCustomerCateg, 300);
    };
    
    return (
        <div>
            <CustomerCategEditForm
                customerCateg={customerCateg}
                updateCustomerCateg={updateCustomerCateg}
                editmodeText={editmodeText}
                handleClose={handleClose}
                modalState={modalState}
            />
        </div>
    );
}

export default CustomerCategEdit;
