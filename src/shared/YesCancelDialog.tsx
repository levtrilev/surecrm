import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useSetRecoilState } from 'recoil';
import { showYesCancelDialogState, yesCancelState } from '../state/state';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};


interface Props {
    modalState: boolean;
    setFromParrent: SetOpenModal;
    questionToConfirm: string;
    editContext: string;
}


export const YesCancelDialog: React.FC<Props> = ({ questionToConfirm, modalState, setFromParrent, editContext }) => {

    const setYesCancel = useSetRecoilState(yesCancelState(editContext));
    const setShowYesCancelDialog = useSetRecoilState(showYesCancelDialogState(editContext));

    const handleClose = () => {
        setFromParrent(false);
    };

    return (
        <div>
            <Modal
                open={modalState}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="parent-modal-title">{questionToConfirm}</h2>
                    <div>
                        <Button onClick={()=>{setYesCancel(true); setShowYesCancelDialog(false);}}>Yes</Button>
                        <Button onClick={()=>{setYesCancel(false); setShowYesCancelDialog(false);}}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default YesCancelDialog;