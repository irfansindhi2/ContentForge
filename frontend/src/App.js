import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Responsibilities from './pages/Responsibilities';
import Form from './components/Form/Form';
import List from './components/List/List';
import Login from './pages/Login';
import SearchPage from './components/List/SearchPage';
import WebsiteBuilder from './components/WebsiteBuilder/WebsiteBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/form/:formName" element={<Form />} />
        <Route path="/responsibilities" element={<Responsibilities />} />
        <Route path="/list/:listName" element={<List />} /> 
        <Route path="/search/:listName" element={<SearchPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/website-builder" element={<WebsiteBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
