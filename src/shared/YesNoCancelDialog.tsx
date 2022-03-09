import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useSetRecoilState } from 'recoil';
import { showYesNoCancelDialogState, yesNoCancelState } from '../state/state';

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


export const YesNoCancelDialog: React.FC<Props> = ({ questionToConfirm, modalState, setFromParrent, editContext }) => {

    const setYesNoCancel = useSetRecoilState(yesNoCancelState(editContext));
    const setShowYesNoCancelDialog = useSetRecoilState(showYesNoCancelDialogState(editContext));

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
                        <Button onClick={()=>{setYesNoCancel('yes'); setShowYesNoCancelDialog(false);}}>Yes</Button>
                        <Button onClick={()=>{setYesNoCancel('no'); setShowYesNoCancelDialog(false);}}>No</Button>
                        <Button onClick={()=>{setYesNoCancel('cancel'); setShowYesNoCancelDialog(false);}}>Cancel</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default YesNoCancelDialog;