import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Meetings from './pages/Meetings'
import MeetingForm from './pages/MeetingForm'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Meetings />} />
            <Route path="/meetings/new" element={<MeetingForm />} />
          </Route>
          <Route path="/meetings/:id/edit" element={<MeetingForm />} />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </AuthProvider>
  )
}

export default App
