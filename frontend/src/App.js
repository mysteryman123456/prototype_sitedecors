import React, { lazy , Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import ContainerLoader from './components/loaders/ContainerLoader';
// auth
const Login = lazy(() => import("./auth/Login"));
const Signup = lazy(() => import("./auth/Signup"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));
const EmailInitiator = lazy(() => import("./auth/EmailInitiator"));
// home
const Home = lazy(() => import("./components/Home"));
const Navbar = lazy(() => import("./components/Navbar"));
const Footer = lazy(() => import("./components/Footer"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
// dashboard
const Dashboard  = lazy(() => import("./components/dashboard/Dashboard"));
const AddWebsite = lazy(() => import("./components/dashboard/AddWebsite"));
const Profile = lazy(() => import("./components/dashboard/Profile"));
const EditListing = lazy(() => import("./components/dashboard/EditListing"));
const Statistics = lazy(() => import("./components/dashboard/Statistics"));

// product page
const ProductPage = lazy(() => import("./components/productpage/ProductPage"));

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: "60vh"}}>
        <Suspense fallback={<ContainerLoader/>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:category" element={<Home />} />
          <Route path="/:category/:subcategory" element={<Home />} />
          <Route path="/website/:web_id" element={<ProductPage />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/email-initiator/:action" element={<EmailInitiator />} />
          <Route path="/user/dashboard" element={<Dashboard />}>
            <Route index element={<Statistics/>} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="add-website" element={<AddWebsite />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-listing" element={<EditListing />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </Suspense>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
