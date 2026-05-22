import { Routes, Route } from "react-router-dom"
import LoginPage from "../authpage/LoginPage"
import RegisterPage from "../authpage/Registerpage"
import { Navbar } from "../Onbordingpage/Navbar"
import HomePage from "../Onbordingpage/HomePage"
import VerifyOtp from "../authpage/VerifyOtp"
const  AuthRoutes=() => {
  return (
    <>
     

      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* Public */}
        <Route path="/" element={ <HomePage />} />
      </Routes>
    </>
  )
}

export default AuthRoutes
