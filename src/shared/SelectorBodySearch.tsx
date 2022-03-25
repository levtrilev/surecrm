import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { IconButton, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { selectorListState } from '../state/state';

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
    takeItem: (id: number) => void;
    editItem: (id: number) => void;
    editContext: string;
}

const SelectorBody: React.FC<Props> = ({ items, dialogHeading, openSelector, closeSelector, takeItem, editItem, editContext }) => {

    const isInitialMount = useRef(true);
    const [selectorList, setSelectorList] = useRecoilState(selectorListState(editContext+'.'+dialogHeading));
    let itemsFiltered: any[] = [...items];
    const onSearchTextChange = (event: any) => {
        if (event.target.value !== '') {
            itemsFiltered = [];
            let i = 0;
            items.forEach(element => {
                if (element.name.toLowerCase().includes(event.target.value.toLowerCase())) {
                    itemsFiltered = [...itemsFiltered, element];
                    i++;
                }
            });
            if (i > 0) {
                setSelectorList(itemsFiltered)
            } else {
                setSelectorList([]);
            }
        } else {
            setSelectorList(items);
        }
    }
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setSelectorList(items);
         }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsFiltered]);
    return (
        <React.Fragment>
            <Modal
                hideBackdrop
                open={openSelector}
                onClose={closeSelector}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 360, maxHeight: 460 }}>
                    <h2 id="child-modal-title">{dialogHeading}</h2>
                    <TextField
                        id="outlined-search"
                        label="Search..."
                        type="search"
                        onChange={onSearchTextChange}
                    />
                    <Box sx={{ width: 320, maxHeight: 300, overflow: 'auto' }}>
                        <List>
                            {itemsFiltered.length ? selectorList.map(
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
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default SelectorBody;