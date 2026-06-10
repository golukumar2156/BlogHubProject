import React from "react"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import AdminDashboardPage from "../Adminpage/AdminDashboardPage"
import { AdminSidebar } from "../Adminpage/adminsideBar/AdminSidebar"
import CategoryPage from "../Adminpage/adminsideBar/CategoryPage"

const AdminLayout = () => {
  return (
    <div className="flex bg-background min-h-screen">
      {/* Sidebar — fixed on desktop, drawer on mobile */}
      <AdminSidebar />

      {/* Main content — offset for desktop sidebar, top bar on mobile */}
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="categories" element={<CategoryPage />} />
        {/* <Route path="users" element={<UsersPage />} /> */}
      </Route>

      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<div className="p-8">Page Not Found</div>} />
    </Routes>
  )
}

export default AdminRoutes