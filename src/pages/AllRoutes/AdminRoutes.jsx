import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import AdminDashboardPage from "../Adminpage/AdminDashboardPage"
// import UsersPage from "../Adminpage/UsersPage" // optional
import { AdminSidebar } from "../Adminpage/adminsideBar/AdminSidebar"
import { Outlet } from "react-router-dom"
import CategoryPage from "../Adminpage/adminsideBar/CategoryPage"
const AdminRoutes = () => {
  return (
    <Routes>
      {/* Redirect /admin to dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="categories" element={<CategoryPage/>} />
        {/* <Route path="users" element={<UsersPage />} /> */}
      </Route>

      {/* Redirect / to /admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Fallback */}
      <Route path="*" element={<div className="p-8">Page Not Found</div>} />
    </Routes>
  )
}

// Layout wrapper to include sidebar
const AdminLayout = ({ children }) => {
  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        {/* This is where pages render */}
        <Outlet/>
      </div>
    </div>
  )
}

export default AdminRoutes
