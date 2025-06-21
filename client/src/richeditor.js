import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function RichEditor() {
    const [data, setData] = useState('');

    return (
        <div>
            <h2>Collaborative Document Editor</h2>
            <CKEditor
                editor={ClassicEditor}
                data={data}
                onChange={(event, editor) => {
                    const newData = editor.getData();
                    setData(newData);
                }}
            />
        </div>
    );
}

export default RichEditor;
