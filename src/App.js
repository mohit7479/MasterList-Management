import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layouts';
import Dashboard from './components/Dashboard';
import ItemsMaster from './components/ItemsMaster';
import BillOfMaterials from './components/BillOfMaterials';
import FileHandler from './components/FileHandler';
import BulkDataManagement from './components/BulkDataManagement'; // Uncommented for bulk operations
import AuditLog from './components/AuditLog';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import ErrorReport from './components/ErrorReport'; // New Component Placeholder

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/items-master" element={<ItemsMaster />} />
        <Route path="/bill-of-materials" element={<BillOfMaterials />} />
        <Route path="/file-handler" element={<FileHandler />} />
        <Route path="/audit-log" element={<AuditLog />} />
        <Route path="/bulk-data-management" element={<BulkDataManagement />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <>
      <ToastContainer />
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </>
  );
};

export default App;
