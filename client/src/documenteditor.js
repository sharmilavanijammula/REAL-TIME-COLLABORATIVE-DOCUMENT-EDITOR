import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');
const DOCUMENT_ID = 'my-document-123';

export default function DocumentEditor() {
    const [content, setContent] = useState('');
    const editorRef = useRef(null);

    useEffect(() => {
        socket.emit('get-document', DOCUMENT_ID);

        socket.on('load-document', doc => {
            setContent(doc);
        });

        socket.on('receive-changes', delta => {
            setContent(prev => prev + delta);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleChange = (e) => {
        const value = e.target.value;
        setContent(value);
        socket.emit('send-changes', value);
        socket.emit('save-document', value);
    };

    return (
        <textarea
            ref={editorRef}
            value={content}
            onChange={handleChange}
            style={{ width: '100%', height: '90vh', fontSize: '18px' }}
        />
    );
}
