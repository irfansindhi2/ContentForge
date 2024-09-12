import React from 'react';
import { Resizable } from 'react-resizable';

function SliderWidget({ id, content, onUpdate, onDelete }) {
  const defaultContent = {
    imageUrls: [''],
    backgroundColor: '#f0f0f0',
  };

  const currentContent = { ...defaultContent, ...content };

  const handleChange = (field, value) => {
    onUpdate(id, { ...currentContent, [field]: value });
  };

  const handleImageUrlChange = (e, index) => {
    const newUrls = [...currentContent.imageUrls];
    newUrls[index] = e.target.value;
    handleChange('imageUrls', newUrls);
  };

  const addImageUrl = () => {
    handleChange('imageUrls', [...currentContent.imageUrls, '']);
  };

  return (
    <Resizable
      width={200}
      height={200}
      onResize={(e, { size }) => {
        // Handle resize if needed
      }}
    >
      <div className="widget slider-widget">
        <h2>Slider</h2>
        {currentContent.imageUrls.map((url, i) => (
          <input
            key={i}
            type="text"
            value={url}
            onChange={(e) => handleImageUrlChange(e, i)}
            placeholder={`Image URL ${i + 1}`}
          />
        ))}
        <button onClick={addImageUrl}>Add Image</button>
        <input
          type="color"
          value={currentContent.backgroundColor}
          onChange={(e) => handleChange('backgroundColor', e.target.value)}
        />
        <label>Background Color</label>
        <button onClick={() => onDelete(id)}>Delete</button>
        
        <div style={{
          backgroundColor: currentContent.backgroundColor,
          padding: '20px',
          marginTop: '10px'
        }}>
          {/* Here you would typically implement a slider component */}
          <p>Slider with {currentContent.imageUrls.length} images</p>
        </div>
      </div>
    </Resizable>
  );
}

export default SliderWidget;