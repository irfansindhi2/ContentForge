import React from 'react';
import { Resizable } from 'react-resizable';

function ArticleWidget({ id, content, onUpdate, onDelete }) {
  const defaultContent = {
    title: 'Article Title',
    body: 'Article content goes here...',
    backgroundColor: '#ffffff',
    textColor: '#000000',
  };

  const currentContent = { ...defaultContent, ...content };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  return (
    <Resizable
      width={200}
      height={200}
      onResize={(e, { size }) => {
        // Handle resize if needed
      }}
    >
      <div className="widget article-widget">
        <h2>Article</h2>
        <input
          type="text"
          value={currentContent.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Article Title"
        />
        <textarea
          value={currentContent.body}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Article Body"
        />
        <input
          type="color"
          value={currentContent.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
        <label>Background Color</label>
        <input
          type="color"
          value={currentContent.textColor}
          onChange={(e) => handleChange('textColor', e.target.value)}
        />
        <label>Text Color</label>
        <button onClick={() => onDelete(id)}>Delete</button>
        
        <div style={{
          backgroundColor: currentContent.backgroundColor,
          color: currentContent.textColor,
          padding: '20px',
          marginTop: '10px'
        }}>
          <h3>{currentContent.title}</h3>
          <p>{currentContent.body}</p>
        </div>
      </div>
    </Resizable>
  );
}

export default ArticleWidget;