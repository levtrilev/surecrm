import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

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

interface Props {
    items: any[];
    dialogHeading: string;
    openSelector: boolean;
    closeSelector: () => void;
    // itemClickHandle: (event: any, id: number) => void;
    takeItem: (id: number) => void;
    editItem: (id: number) => void;
}

const SelectorBody: React.FC<Props> = ({ items, dialogHeading, openSelector, closeSelector, takeItem, editItem }) => {
    // const SelectorBody: React.FC<Props> = ({ items, dialogHeading, openSelector, closeSelector, itemClickHandle }) => {

    return (
        <React.Fragment>
            <Modal
                hideBackdrop
                open={openSelector}
                onClose={closeSelector}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 300, maxHeight: 360, overflow: 'auto' }}>
                    <h2 id="child-modal-title">{dialogHeading}</h2>
                    <p id="child-modal-description">
                        Pick from the list (Esc to Cancel)
                    </p>
                    <List>
                        {items.length ? items.map(
                            (item) => <ListItem key={item.id} disablePadding>
                                <ListItemButton onClick={() => takeItem(item.id)} onDoubleClick={() => editItem(item.id)}>
                                    <ListItemText primary={`(${item.id}) ${item.name}`} />
                                </ListItemButton>
                                <IconButton size="medium" onClick={() => editItem(item.id)}>
                                    <EditIcon />
                                </IconButton>                                
                                {/* <ListItemButton onClick={(event) => itemClickHandle(event, item.id)} >
                                    <ListItemText primary={`(${item.id}) ${item.name}`} />
                                </ListItemButton> */}
                            </ListItem>
                        ) : <ListItem>"No records"</ListItem>}
                    </List>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default SelectorBody;