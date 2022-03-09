import React, { useEffect } from 'react'
import {
    useRecoilState,
    useRecoilValue,
    useRecoilRefresher_UNSTABLE,
} from 'recoil';
import { currentCustomerIdState, customerQuery, customersQuery, customersFullQuery } from './data/customerState'
import { Container, Grid } from '@mui/material';
import YesCancelDialog from '../../shared/YesCancelDialog';
import { openEditModalState, showYesCancelDialogState, yesCancelState } from '../../state/state';
import { deleteCustomer } from './data/customerDao';
import Customer from './Customer';
import CustomerEdit from './CustomerEdit';

let editContext = 'Customers';

const Customers: React.FC = () => {

    const customers = useRecoilValue(customersFullQuery) as CustomerFullType[];
    const refreshCustomers = useRecoilRefresher_UNSTABLE(customersQuery);
    const customerToOpen = useRecoilValue(customerQuery(editContext));
    const currentCustomerId = useRecoilValue(currentCustomerIdState(editContext));
    const [yesCancel, setYesCancel] = useRecoilState(yesCancelState(editContext));
    const [showYesCancelDialog, setShowYesCancelDialog] = useRecoilState(showYesCancelDialogState(editContext));
    const [openEditModal, setOpenEditModal] = useRecoilState(openEditModalState);

    useEffect(() => {
        if (yesCancel) {
            deleteCustomer(currentCustomerId);
            setTimeout(refreshCustomers, 300);
            setYesCancel(false);
        }
    }, [currentCustomerId, refreshCustomers, setYesCancel, yesCancel]);

    return (
        <div style={{ margin: 80 }}>
            <div className="blog-content layout">
                <Grid container spacing={0} border={0.5}>
                    <Grid item xs={1}>
                        <Container>id</Container>
                    </Grid>
                    <Grid item xs={8}>
                        <Container>Customer</Container>
                    </Grid>
                    <Grid item xs={1}>
                        <Container>Blocked</Container>
                    </Grid>
                    <Grid item xs={2}>
                        <Container style={{ paddingLeft: 32, paddingRight: 4, alignItems: 'center', justifyContent: 'center' }}>Actions</Container>
                    </Grid>
                </Grid>
                {customers.length ? customers.map(customer => <Customer key={customer.id} customer={customer} />) : <tr>"Нет записей"</tr>}
            </div>
            {openEditModal ? <CustomerEdit
                customer={customerToOpen}
                modalState={openEditModal}
                setFromParrent={setOpenEditModal}
                editmodeText='edit mode'
                outerEditContext={editContext}
            /> : <></>}
            {showYesCancelDialog ? <YesCancelDialog questionToConfirm={`Delete Customer (id = ${customerToOpen.id}) ?`}
                modalState={showYesCancelDialog} setFromParrent={setShowYesCancelDialog} editContext={editContext} /> : <></>}
        </div>
    )
}

export default Customers
