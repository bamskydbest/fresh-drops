import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import RequestForm from './RequestForm';
import Dashboard from './Dashboard';
import RequestDetails from './RequestDetails';
import ApprovalPage from './ApprovalPage';
import ApproverManagement from './ApproverManagement';
import LandingPage from './LandingPage';
import ApproverLogin from './ApproverLogin';
import ProtectedRoute from './ProtectedRoutes';
import { useState } from 'react';
const App = () => {
   const [menuOpen, setMenuOpen] = useState(false);
  return (
    <BrowserRouter>
       {/* NAVBAR */}
      <nav className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              // src="/fresh-drops.png"
              src="/fresh-drop.jpg"
              alt="Fresh Drops Logo"
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:underline">New Request</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/approvers" className="hover:underline">Manage Approvers</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-blue-800 px-4 pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block hover:underline"
            >
              New Request
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block hover:underline"
            >
              Dashboard
            </Link>
            <Link
              to="/approvers"
              onClick={() => setMenuOpen(false)}
              className="block hover:underline"
            >
              Manage Approvers
            </Link>
          </div>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
<Route path="/request" element={<RequestForm />} />
<Route path="/approver-login" element={<ApproverLogin />} />

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/request/:id" element={<RequestDetails />} />
        <Route path="/approve/:token" element={<ApprovalPage/>} />
        <Route path="/approvers" element={<ApproverManagement/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;