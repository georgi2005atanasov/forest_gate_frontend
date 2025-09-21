import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import PublicLayout from './pages/PublicLayout'
import Landing from './pages/Landing'
import Settings from './pages/Settings'
import PrivateLayout from './pages/PrivateLayout'
import Register from './pages/Register'
import TestUsers from './pages/TestUsers'
import Users from './pages/Users'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="test-users" element={<TestUsers />} />
        </Route>

        <Route element={<PrivateLayout />}>
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Users />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App
