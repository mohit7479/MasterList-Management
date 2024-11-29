import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'
import Layout from './components/Layouts'
import Dashboard from './components/Dashboard'
import ItemsMaster from './components/ItemsMaster'
import BillOfMaterials from './components/BillOfMaterials'
import ProcessSteps from './components/ProcessSteps'
import Processes from './components/Processes'
import FileHandler from './components/FileHandler'
import BulkDataManagement from "./components/BulkDataManagement";
import AuditLog from "./components/AuditLog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Login from './components/Login'


// const PrivateRoute = ({ element, ...rest }) => {
//   const { state } = useAppContext()
//   // Check if the user is authenticated, if not navigate to login
//   if (!state.user) {
//     return <Navigate to="/login" />
//   }
//   return element
// }

const AppContent = () => {
  const { state } = useAppContext()

  return (
    <Layout>
      <ToastContainer />
      <Routes>
        {/* Wrap each route with PrivateRoute to ensure they are protected */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/items-master" element={<ItemsMaster />} />
        <Route path="/bill-of-materials" element={<BillOfMaterials />} />
        <Route path="/processes" element={<Processes />} />
        <Route path="/process-steps" element={< ProcessSteps />} />
        <Route path="/file-handler" element={<FileHandler />} />
        <Route path="/bulk-data-management" element={<BulkDataManagement />} />
        <Route path="/audit-log" element={<AuditLog />} />

      </Routes>
    </Layout>
  )
}

const App = () => {
  return (<>
    <ToastContainer />
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  </>
  )
}

export default App
