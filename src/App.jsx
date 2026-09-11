import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './App.css';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Conteactus from './components/ContactUs';
import Aboutus from './components/Aboutus';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminClients from './components/admin/AdminClients';
import AdminPlans from './components/admin/AdminPlans';
import AdminProjects from './components/admin/AdminProjects';
import AdminBids from './components/admin/AdminBids';
import AdminProfile from './components/admin/AdminProfile';
import ClientDashboard from './components/client/ClientDashboard';
import ClientPostProject from './components/client/ClientPostProject';
import ClientManageProjects from './components/client/ClientManageProjects';
import ClientReviewBids from './components/client/ClientReviewBids';
import ClientProfile from './components/client/ClientProfile';
import UserDashboard from './components/user/UserDashboard';
import UserPlans from './components/user/UserPlans';
import UserProjects from './components/user/UserProjects';
import UserBids from './components/user/UserBids';
import UserProfile from './components/user/UserProfile';

const ProtectedRoute = ({ role, children }) => {
  let info = null;
  try {
    info = JSON.parse(localStorage.getItem('info') || 'null');
  } catch {
    localStorage.removeItem('info');
  }

  if (!info) return <Navigate to="/login" replace />;
  if (role && info.type !== role) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
   return (
   <>
 <BrowserRouter>
 <Navbar/>
  <Routes>
    {/* common url */}
    <Route path='/' element={<Home/>} />
     <Route path='/register' element={<Register />} />
     <Route path='/login' element={<Login />} />
    <Route path='/services' element={<Services />} />
    <Route path='/pricing' element={<Pricing />} />
    <Route path='/contact' element={<Conteactus />} />
    <Route path='/contact-us' element={<Conteactus />} />
    <Route path='/about-us' element={<Aboutus  />} />
    <Route path='/admin-dashboard' element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
    <Route path='/admin-users' element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
    <Route path='/admin-clients' element={<ProtectedRoute role="admin"><AdminClients /></ProtectedRoute>} />
    <Route path='/admin-plans' element={<ProtectedRoute role="admin"><AdminPlans /></ProtectedRoute>} />
    <Route path='/admin-project' element={<ProtectedRoute role="admin"><AdminProjects /></ProtectedRoute>} />
    <Route path='/admin-bids' element={<ProtectedRoute role="admin"><AdminBids /></ProtectedRoute>} />
    <Route path='/admin-profile' element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} />
    <Route path='/client-dashboard' element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>} />
    <Route path='/client-post-projects' element={<ProtectedRoute role="client"><ClientPostProject /></ProtectedRoute>} />
    <Route path='/client-manage-projects' element={<ProtectedRoute role="client"><ClientManageProjects /></ProtectedRoute>} />
    <Route path='/client-review-bids' element={<ProtectedRoute role="client"><ClientReviewBids /></ProtectedRoute>} />
    <Route path='/client-profile' element={<ProtectedRoute role="client"><ClientProfile /></ProtectedRoute>} />
    <Route path='/user-dashboard' element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
    <Route path='/user-plans' element={<ProtectedRoute role="user"><UserPlans /></ProtectedRoute>} />
    <Route path='/user-project' element={<ProtectedRoute role="user"><UserProjects /></ProtectedRoute>} />
    <Route path='/user-bids' element={<ProtectedRoute role="user"><UserBids /></ProtectedRoute>} />
    <Route path='/user-profile' element={<ProtectedRoute role="user"><UserProfile /></ProtectedRoute>} />
   
   
  </Routes>
   <Footer/>
  </BrowserRouter>
  
   </>
  )
}

export default App
