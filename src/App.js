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
import Login from './components/Login'


const PrivateRoute = ({ element, ...rest }) => {
  const { state } = useAppContext()
  // Check if the user is authenticated, if not navigate to login
  if (!state.user) {
    return <Navigate to="/login" />
  }
  return element
}

const AppContent = () => {
  const { state } = useAppContext()

  // If there's no user, show the login page
  if (!state.user) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        {/* Wrap each route with PrivateRoute to ensure they are protected */}
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/items-master" element={<PrivateRoute element={<ItemsMaster />} />} />
        <Route path="/bill-of-materials" element={<PrivateRoute element={<BillOfMaterials />} />} />
        <Route path="/processes" element={<PrivateRoute element={<Processes />} />} />
        <Route path="/process-steps" element={<PrivateRoute element={<ProcessSteps />} />} />
        <Route path="/file-handler" element={<PrivateRoute element={<FileHandler />} />} />
      </Routes>
    </Layout>
  )
}

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  )
}

export default App
