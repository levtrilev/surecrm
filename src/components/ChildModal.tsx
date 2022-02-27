import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useRecoilState, useRecoilValue } from 'recoil';
import { childModalState  } from '../state/state';
import { customersQuery } from './customer/data/customerState';

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

export function ChildModal() {

    const [openChildModal, setOpenChildModal] = useRecoilState(childModalState);
    const customers = useRecoilValue(customersQuery) as CustomerType[];

    return (
        <React.Fragment>
            <Modal
                hideBackdrop
                open={openChildModal}
                onClose={()=>setOpenChildModal(false)}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title">Select a Customer</h2>
                    <p id="child-modal-description">
                        Выберите из списка (Esc to Cancel)
                    </p>
                    {customers.length ? customers.map(customer => <p>({customer.id}) {customer.name}</p>) : <tr>"Нет записей"</tr>}
                    <Button onClick={()=>setOpenChildModal(false)}>OK</Button>
                    <Button onClick={()=>setOpenChildModal(false)}>Cancel</Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default ChildModal;