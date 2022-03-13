import * as React from 'react';
import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@mui/material/Paper';
import { useRef } from 'react';

export default function PaperComponentEnabled(props: PaperProps) {
    const nodeRef = useRef(null);
    return (
        <Draggable
            nodeRef={nodeRef}
            disabled={false}
        >
            <div ref={nodeRef}>
                <Paper {...props} />
            </div>
        </Draggable>
    );
}