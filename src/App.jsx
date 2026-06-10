import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Components
import { Navbar } from "./pages/Onbordingpage/Navbar";

// Auth Pages
import LoginPage from "./pages/authpage/LoginPage";
import RegisterPage from "./pages/authpage/Registerpage";
import VerifyOtp from "./pages/authpage/VerifyOtp";

// Public Pages
import HomePage from "./pages/Onbordingpage/HomePage";
import BlogsPage from "./pages/blog/BlogsPage";
import BlogDetailsPage from "./pages/blog/BlogDetailsPage";
import CategoriesPage from "./pages/Adminpage/adminsideBar/CategoriesPage";

// Blog/User Pages
import Dashboard from "./pages/blog/Dashboard";
import MyBlogs from "./pages/blog/MyBlogs";
import CreateBlog from "./pages/blog/createblog/CreateBlog";
import SettingsPage from "./pages/blog/setting/SettingsPage";
import MyProfile from "./pages/blog/profile/MyProfile";

// Admin — Layout + Pages
import { AdminSidebar } from "./pages/Adminpage/adminsideBar/AdminSidebar";
import { Outlet } from "react-router-dom";
import AdminDashboardPage from "./pages/Adminpage/AdminDashboardPage";
import CategoryPage from "./pages/Adminpage/adminsideBar/CategoryPage";
import UsersPage from "./pages/Adminpage/adminsideBar/UsersPage";

// ── Protected Route: login nahi hai to /login pe bhejo ──
const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth);
  const localToken = localStorage.getItem("token");
  if (!token && !localToken) return <Navigate to="/login" replace />;
  return children;
};

// ── Guest Route: already logged in hai to /dashboard pe bhejo ──
const GuestRoute = ({ children }) => {
  const { token, user } = useSelector((s) => s.auth);
  const localToken = localStorage.getItem("token");
  const localUser  = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const activeToken = token || localToken;
  const activeUser  = user  || localUser;
  if (activeToken) {
    if (activeUser?.role === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Admin Layout wrapper
const AdminLayout = () => {
  const { token, user } = useSelector((s) => s.auth);
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  const location = useLocation();

  const noNavbarRoutes = [
    "/admin",
    "/dashboard",
    "/my-blogs",
    "/create-blog",
    "/settings",
    "/my-profile",
  ];

  const hideNavbar = noNavbarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/*  Public Routes */}
        <Route path="/" element={<GuestRoute><HomePage /></GuestRoute>} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog/:id" element={<BlogDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/*  Auth Routes — logged in hai to redirect to dashboard */}
        <Route path="/login"      element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register"   element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* User Routes — login required */}
        <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-blogs"    element={<ProtectedRoute><MyBlogs /></ProtectedRoute>} />
        <Route path="/create-blog" element={<ProtectedRoute><CreateBlog /></ProtectedRoute>} />
        <Route path="/settings"    element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/my-profile"  element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div className="p-8">Page Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;