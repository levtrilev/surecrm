import { ButtonGroup, Container, Divider, Grid, IconButton } from '@mui/material';
import React from 'react'
import { useSetRecoilState } from 'recoil';
import { currentCustomerIdState, newCustomerState } from './data/customerState';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { openEditModalState, showYesCancelDialogState } from '../../state/state';
import { currentCustomerCategIdState } from '../customerCategory/customerCategoriesState';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
    customer: CustomerFullType;
}

export const Customer: React.FC<Props> = ({ customer }) => {
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState);
    const setCurrentCustomerCategId = useSetRecoilState(currentCustomerCategIdState);
    const setOpenEditModal = useSetRecoilState(openEditModalState);
    const setShowYesCancelDialog = useSetRecoilState(showYesCancelDialogState);
    const setNewCustomer = useSetRecoilState(newCustomerState);

    const fullCustomerToCustomer = (customer: CustomerFullType) => {
        // removes customer_categories
        // to transform customerFullType to customerType
        let { customer_categories, ...newCustomer } = customer;
        return (newCustomer);
    };

    return (
        <>
            <Grid container spacing={0} >
                <Grid item xs={1}>
                    <Container>{customer.id}</Container>
                </Grid>
                <Grid item xs={8}>
                    <Container>{customer.name}</Container>
                </Grid>
                <Grid item xs={1}>
                    <Container>{customer.blocked ? 'v' : ' '}</Container>
                </Grid>
                <Grid item xs={2} >
                    <Container >
                        <ButtonGroup>
                            <IconButton size="medium" onClick={() => {
                                setShowYesCancelDialog(true);
                                setCurrentCustomerId(customer.id);
                            }}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton size="medium" onClick={() => {
                                setCurrentCustomerId(customer.id);
                                setNewCustomer(fullCustomerToCustomer(customer));
                                setOpenEditModal(true);
                                setCurrentCustomerCategId(customer.category_id);
                            }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton size="medium" onClick={() => {
                            }}>
                                <ContentCopyIcon />
                            </IconButton>
                        </ButtonGroup>
                    </Container>
                </Grid>                {/* <Grid item xs={1} >
                    <Container >
                        <IconButton size="medium" onClick={() => {
                            setShowYesCancelDialog(true);
                            setCurrentCustomerId(customer.id);
                        }}>
                            <DeleteIcon />
                        </IconButton>
                    </Container>
                </Grid> */}
                {/* <Grid item xs={1} >
                    <Container >
                        <IconButton size="medium" onClick={() => {
                            setCurrentCustomerId(customer.id);
                            setCurrentCustomerCategId(customer.category_id);
                            setNewCustomer(customer);
                            setOpenEditModal(true);
                        }}>
                            <EditIcon />
                        </IconButton>
                    </Container>
                </Grid> */}
                {/* <Grid item xs={0}>
                    <Container>{''}</Container>
                </Grid> */}
            </Grid>
            <Divider />
        </>
    )
}

export default React.memo(Customer)