import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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

const Navbar = ({ menuOpen, setMenuOpen, loggedIn }: any) => (
  <nav className="bg-blue-900 text-white">
    <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center">
        <img src="/fresh-drop.jpg" alt="Fresh Drops Logo" className="h-20 w-auto" />
      </Link>

      <div className="hidden md:flex space-x-6">
        <Link to="/" className="hover:underline">New Request</Link>
        {loggedIn && (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/approvers" className="hover:underline">Manage Approvers</Link>
          </>
        )}
      </div>

      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <HiX size={30} /> : <HiMenu size={30} />}
      </button>
    </div>

    {menuOpen && (
      <div className="md:hidden bg-blue-800 px-4 pb-4 space-y-3">
        <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:underline">New Request</Link>
        {loggedIn && (
          <>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block hover:underline">Dashboard</Link>
            <Link to="/approvers" onClick={() => setMenuOpen(false)} className="block hover:underline">Manage Approvers</Link>
          </>
        )}
      </div>
    )}
  </nav>
);

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('approver_token'));

  return (
    <BrowserRouter>
      <AppWrapper
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
    </BrowserRouter>
  );
};

// Wrapper to use useLocation inside BrowserRouter
const AppWrapper = ({ menuOpen, setMenuOpen, loggedIn, setLoggedIn }: any) => {
  const location = useLocation();
  const hideNavbar = location.pathname === '/approver-login';

  return (
    <>
      {!hideNavbar && <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} loggedIn={loggedIn} />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/request" element={<RequestForm />} />
        <Route
          path="/approver-login"
          element={<ApproverLogin setLoggedIn={setLoggedIn} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/request/:id" element={<RequestDetails />} />
        <Route path="/approve/:token" element={<ApprovalPage />} />
        <Route
          path="/approvers"
          element={
            <ProtectedRoute>
              <ApproverManagement />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
