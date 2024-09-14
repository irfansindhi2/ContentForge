import { useState, useEffect } from 'react';

function useFormPosition(widgetRef, formRef, isEditing, draggedPosition, id) {
  const [formTransform, setFormTransform] = useState('translateY(0)');
  const [formTop, setFormTop] = useState('100%');
  const [formPosition, setFormPosition] = useState('below');

  const updateFormPosition = () => {
    if (formRef.current && widgetRef.current) {
      const widgetRect = widgetRef.current.getBoundingClientRect();
      const formHeight = formRef.current.offsetHeight;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      const spaceAbove = widgetRect.top;
      const spaceBelow = viewportHeight - widgetRect.bottom;

      const buffer = 20;

      if (formPosition === 'below') {
        if (spaceBelow < formHeight + buffer && spaceAbove >= formHeight + buffer) {
          setFormPosition('above');
          setFormTop('0');
          setFormTransform('translateY(-100%)');
        }
      } else if (formPosition === 'above') {
        if (spaceAbove < formHeight + buffer && spaceBelow >= formHeight + buffer) {
          setFormPosition('below');
          setFormTop('100%');
          setFormTransform('translateY(0)');
        }
      } else {
        if (spaceBelow >= formHeight + buffer) {
          setFormPosition('below');
          setFormTop('100%');
          setFormTransform('translateY(0)');
        } else if (spaceAbove >= formHeight + buffer) {
          setFormPosition('above');
          setFormTop('0');
          setFormTransform('translateY(-100%)');
        } else {
          setFormPosition('below');
          setFormTop('100%');
          setFormTransform('translateY(0)');
        }
      }
    }
  };

  useEffect(() => {
    if (isEditing) {
      updateFormPosition();
      const handleWindowResize = () => updateFormPosition();
      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
    }
  }, [isEditing]);

  useEffect(() => {
    if (draggedPosition && draggedPosition.id === id) {
      updateFormPosition();
    }
  }, [draggedPosition]);

  return { formTransform, formTop };
}

export default useFormPosition;