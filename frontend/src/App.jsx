import React, { lazy, Suspense } from "react";
import {Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
import './App.css';
import AppFooter from "./components/Footer";


const Home = lazy(()=> import('./pages/Home'))
const Login = lazy(()=> import('./components/Login'))
const SignUp = lazy(()=> import('./components/SignUp'))
const AdminDashboard = lazy(()=> import('./Admin/AdminDashboard'))
// const Analytics = lazy(()=> import('./Admin/Analytics'))
const ManagerDashboard = lazy(()=> import('./pages/ManagerDashboard'))
const EmployeeDashboard = lazy(()=> import('./pages/EmployeeDashboard'))
const PageNotFound = lazy(()=> import('./utils/ErrorBoundary'))
const About = lazy(()=> import('./pages/About'))
const Profile = lazy(()=> import('./pages/Profile'))


function App() {
  return (
    <div className="App">
      <Suspense fallback={<div><Loading/></div>}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/adminDashboard" element={<AdminDashboard/>}/>
          {/* <Route path="/analytics" element={<Analytics/>}/> */}
          <Route path="/managerDashboard" element={<ManagerDashboard/>}/>
          <Route path="/employeeDashboard" element={<EmployeeDashboard/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/profile" element={<Profile/>}/>


          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
        <AppFooter/>
      </Suspense>
    </div>
  );
}

export default App;
