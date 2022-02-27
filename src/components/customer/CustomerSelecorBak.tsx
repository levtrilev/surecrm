import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currentCustomerIdState, customersQuery } from './data/customerState';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import CustomerList from './CustomerList';
import { openCustomerSelectorState } from './data/customerState';

const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export function CustomerSelecorBak() {

    const [openCustomerSelector, setOpenCustomerSelector] = useRecoilState(openCustomerSelectorState);
    const customers = useRecoilValue(customersQuery) as CustomerType[];
    const setCurrentCustomerId = useSetRecoilState(currentCustomerIdState);

    return (
        <React.Fragment>
            <Modal
                hideBackdrop
                open={openCustomerSelector}
                onClose={() => setOpenCustomerSelector(false)}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 300, maxHeight: 360, overflow: 'auto' }}>
                    {/* <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}> */}
                    <h2 id="child-modal-title">Select a Customer</h2>
                    <p id="child-modal-description">
                        Pick from the list (Esc to Cancel)
                    </p>
                    <List>
                        {customers.length ? customers.map(
                            (customer) => <ListItem key={customer.id} disablePadding>
                                <ListItemButton onClick={() => {
                                    setCurrentCustomerId(customer.id);
                                    setTimeout(() => {
                                        setOpenCustomerSelector(false);
                                    }, 300);
                                }}>
                                    <ListItemText primary={`(${customer.id}) ${customer.name}`} />
                                </ListItemButton>
                            </ListItem>
                        ) : <ListItem>"Нет записей"</ListItem>}
                    </List>
                    {/* <CustomerList /> */}
                    {/* <Button onClick={() => setOpenChildModal(false)}>OK</Button>
                    <Button onClick={() => setOpenChildModal(false)}>Cancel</Button> */}
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default CustomerSelecorBak;