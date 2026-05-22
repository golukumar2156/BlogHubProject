import { Routes, Route, useLocation } from "react-router-dom";

// Components
import { Navbar } from "./pages/Onbordingpage/Navbar";

// Auth Pages
import LoginPage from "./pages/authpage/LoginPage";
import RegisterPage from "./pages/authpage/Registerpage";

// Public Pages
import HomePage from "./pages/Onbordingpage/HomePage";
import BlogsPage from "./pages/blog/BlogsPage";
import BlogDetailsPage from "./pages/blog/BlogDetailsPage";

// Blog/User Pages
import Dashboard from "./pages/blog/Dashboard";
import MyBlogs from "./pages/blog/MyBlogs";
import CreateBlog from "./pages/blog/createblog/CreateBlog";
import SettingsPage from "./pages/blog/setting/SettingsPage";

// Admin Pages
import AdminDashboardPage from "./pages/Adminpage/AdminDashboardPage";
import CategoriesPage from "./pages/Adminpage/adminsideBar/CategoriesPage";
import CategoryPage from "./pages/Adminpage/adminsideBar/CategoryPage";
import VerifyOtp from "./pages/authpage/VerifyOtp";

function App() {
  const location = useLocation();

  // 🔥 All routes where Navbar should NOT appear
  const noNavbarRoutes = [
    "/admin",
    "/dashboard",
    "/my-blogs",
    "/create-blog",
    "/settings",
  ];

  const hideNavbar = noNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {/* ✅ Navbar only for PUBLIC pages */}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* 🌍 Public Routes */}
        
        <Route path="/" element={<HomePage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />

        {/* 🔐 Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtp/>} />


        {/* 👤 User Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-blogs" element={<MyBlogs />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* 🛠️ Admin Routes */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/category/:id" element={<CategoryPage />} />
      </Routes>
    </>
  );
}

export default App;
