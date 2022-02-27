import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { handleMenuItemClick, pages, navSvgIcons } from './navFunctions';

const drawerWidth = 240;

export default function MainDrawer() {
    let navigate = useNavigate();
    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar style={{ height: 68 }} />
            <Divider />
            <List>
                {pages.map((text, index) => {
                    const Icon = navSvgIcons[index];
                    return (
                        <ListItem key={text} button onClick={(event) => {
                            handleMenuItemClick(navigate, event, index)
                        }
                        }>
                            <ListItemIcon>
                                <Icon />
                                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    );
                }
                )}
            </List>
            <Divider />
        </Drawer>
    );
}
