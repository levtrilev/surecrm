import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.primary,
}));

export function debounce(callback: (event: any) => void, delay: number) {
    let timeout: number; //NodeJS.Timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout((event) => callback(event), delay);
    }
}