import React, { useState } from 'react';
import './TextBlock.css'; // Importing the styles specific to TextBlock

function TextBlock() {
    const [content, setContent] = useState("Enter text here...");

    return (
        <div className="text-block">
            <p
                contentEditable="true"
                onInput={(e) => setContent(e.currentTarget.textContent)}
                suppressContentEditableWarning={true} // To avoid React warnings about contentEditable
            >
                {content}
            </p>
        </div>
    );
}

export default TextBlock;
