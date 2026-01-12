import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Placeholder pages (will be replaced by real components)
import Dashboard from './pages/Dashboard';
import Agenda from './pages/Agenda';
import Finance from './pages/Finance';
import Documents from './pages/Documents';
import NewContract from './pages/NewContract';
import Expenses from './pages/Expenses';
import Withdrawals from './pages/Withdrawals';
import Clients from './pages/Clients';
import Vault from './pages/Vault';
import Visits from './pages/Visits';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/new-contract" element={<NewContract />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/visits" element={<Visits />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
