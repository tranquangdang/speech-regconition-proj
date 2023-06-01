import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import ConsentsPage from './components/ConsentList/ConsentsPage';
import Layout from './components/Layout';
import RegisterForm from './components/Home/RegisterForm';
import AgreementPage from './components/Home/AgreementPage';
import FinishedPage from './components/Home/FinishedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Layout />}>
          <Route path="" element={<Home />}>
            <Route index element={<RegisterForm />} />
            <Route path="agreement-page" element={<AgreementPage />} />
            <Route path="finished-page" element={<FinishedPage />} />
          </Route>
          <Route path="consents-page" element={<ConsentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
