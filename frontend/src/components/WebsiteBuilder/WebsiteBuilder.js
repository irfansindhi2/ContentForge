import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropArea from './DropArea';
import HeaderWidget from './widgets/HeaderWidget';
import FooterWidget from './widgets/FooterWidget';
import ArticleWidget from './widgets/ArticleWidget';
import SliderWidget from './widgets/SliderWidget';
import MenuWidget from './widgets/MenuWidget';
import AdWidget from './widgets/AdWidget';
import JSZip from 'jszip';

function WebsiteBuilder() {
  const [widgets, setWidgets] = useState([]);
  const [articlesGenerated, setArticlesGenerated] = useState(false);

  const addWidget = (type) => {
    let newWidget = { id: Date.now(), type };
    switch (type) {
      case 'Header':
        newWidget.content = {
          title: 'Welcome to Our Website',
          subtitle: 'Discover amazing content',
          backgroundColor: '#f8f9fa',
          textColor: '#333333',
          alignment: 'center',
        };
        break;
      case 'Footer':
        newWidget.content = '';
        break;
      case 'Article':
        newWidget.content = { title: '', body: '' };
        break;
      case 'Slider':
        newWidget.content = { imageUrls: [''] };
        break;
      case 'Menu':
        newWidget.content = { menuItems: [''] };
        break;
      case 'Ad':
        newWidget.content = { imageUrl: '', linkUrl: '' };
        break;
      default:
        newWidget.content = '';
    }
    setWidgets([...widgets, newWidget]);
  };

  const updateWidget = (id, content) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === id) {
        return { ...widget, content };
      }
      return widget;
    }));
  };

  const deleteWidget = (id) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const moveWidget = (fromIndex, toIndex) => {
    const updatedWidgets = [...widgets];
    const [movedWidget] = updatedWidgets.splice(fromIndex, 1);
    updatedWidgets.splice(toIndex, 0, movedWidget);
    setWidgets(updatedWidgets);
  };

  const generateHTML = (articleNumber = '') => {
    const css = `
      /* Add your CSS styles here */
      body { font-family: Arial, sans-serif; }
      .header { /* ... */ }
      .footer { /* ... */ }
      .article { /* ... */ }
      .slider { /* ... */ }
      .menu { /* ... */ }
      .ad { /* ... */ }
    `;

    const js = `
      // Add your JavaScript code here
      console.log('Website loaded');
    `;

    const widgetToHTML = (widget) => {
      switch (widget.type) {
        case 'Header':
          return `
            <header class="header" style="background-color: ${widget.content?.backgroundColor || '#f8f9fa'}; color: ${widget.content?.textColor || '#333333'}; text-align: ${widget.content?.alignment || 'center'};">
              <h1>${widget.content?.title || 'Welcome'}</h1>
              <p>${widget.content?.subtitle || ''}</p>
            </header>
          `;
        case 'Footer':
          return `
            <footer class="footer" style="background-color: ${widget.content?.backgroundColor || '#333333'}; color: ${widget.content?.textColor || '#ffffff'};">
              <p>${widget.content?.copyright || '© 2023 Your Company'}</p>
              <nav>
                ${(widget.content?.links || []).map(link => `<a href="${link?.url || '#'}" style="color: ${widget.content?.textColor || '#ffffff'};">${link?.text || 'Link'}</a>`).join(' ')}
              </nav>
            </footer>
          `;
        case 'Article':
          return `<article class="article"><h2>${widget.content?.title || 'Article Title'}</h2><p>${widget.content?.body || 'Article content goes here.'}</p></article>`;
        case 'Slider':
          return `<div class="slider">${(widget.content?.imageUrls || []).map(url => `<img src="${url || '#'}" alt="Slider image">`).join('')}</div>`;
        case 'Menu':
          return `<nav class="menu"><ul>${(widget.content?.menuItems || []).map(item => `<li>${item || 'Menu item'}</li>`).join('')}</ul></nav>`;
        case 'Ad':
          return `<div class="ad"><a href="${widget.content?.linkUrl || '#'}"><img src="${widget.content?.imageUrl || '#'}" alt="Advertisement"></a></div>`;
        default:
          return '';
      }
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Newspaper Site${articleNumber ? ` - Article ${articleNumber}` : ''}</title>
        <style>${css}</style>
      </head>
      <body>
        ${widgets.map(widgetToHTML).join('')}
        ${articleNumber ? `<div class="article-content">This is the content for article ${articleNumber}</div>` : ''}
        <script>${js}</script>
      </body>
      </html>
    `;
  };

  const generateArticles = () => {
    const zip = new JSZip();
    for (let i = 0; i < 10000; i++) {
      const html = generateHTML(i + 1);
      zip.file(`article_${i + 1}.html`, html);
    }
    
    zip.generateAsync({type:"blob"}).then(function(content) {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = "articles.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    setArticlesGenerated(true);
    alert('10,000 HTML files have been generated and zipped. Download should start shortly.');
  };

  const updateArticles = () => {
    generateArticles(); // In this case, updating is the same as generating new articles
    alert('All HTML files have been updated and zipped. Download should start shortly.');
  };

  const downloadCurrentLayout = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'current_layout.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="website-builder">
        <button onClick={() => addWidget('Header')}>Add Header</button>
        <button onClick={() => addWidget('Footer')}>Add Footer</button>
        <button onClick={() => addWidget('Article')}>Add Article</button>
        <button onClick={() => addWidget('Slider')}>Add Slider</button>
        <button onClick={() => addWidget('Menu')}>Add Menu</button>
        <button onClick={() => addWidget('Ad')}>Add Ad</button>
        <DropArea>
          {widgets.map((widget, index) => {
            const WidgetComponent = {
              Header: HeaderWidget,
              Footer: FooterWidget,
              Article: ArticleWidget,
              Slider: SliderWidget,
              Menu: MenuWidget,
              Ad: AdWidget
            }[widget.type];

            return (
              <WidgetComponent
                key={widget.id}
                id={widget.id}
                index={index}
                content={widget.content}
                onUpdate={updateWidget}
                onDelete={deleteWidget}
                moveWidget={moveWidget}
              />
            );
          })}
        </DropArea>
        <button onClick={generateArticles}>Generate 10,000 Articles</button>
        <button onClick={updateArticles}>Update Articles</button>
        <button onClick={downloadCurrentLayout}>Download Current Layout</button>
      </div>
    </DndProvider>
  );
}

export default WebsiteBuilder;