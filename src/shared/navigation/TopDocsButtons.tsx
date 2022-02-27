import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

interface Props {
    id: number;
    refreshAction: () => void;
    deleteAction: (id: number) => void;
    createNewAction: () => void;
    copyAction: (id: number) => void;
}

export const TopDocsButtons: React.FC<Props> = ({ id, refreshAction, deleteAction, createNewAction, copyAction }) => {
    // let navigate = useNavigate();
    return (
        <div style={{margin: '4px 0px',}}>
            <ButtonGroup variant="outlined" aria-label="outlined button group">
                <Button onClick={ refreshAction} startIcon={<RefreshIcon />}>
                    Refresh
                </Button>
                <Button onClick={createNewAction} startIcon={<CreateIcon />}>
                    Create new
                </Button>
                {/* <Button onClick={() => copyAction(id)} startIcon={<ContentCopyIcon />}>
                    Copy
                </Button> */}
                <Button onClick={() => deleteAction(id)} endIcon={<DeleteOutlineIcon />}>
                    Delete
                </Button>
            </ButtonGroup>
        </div>
    );
}
export default TopDocsButtons;