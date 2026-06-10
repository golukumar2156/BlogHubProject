// This file is kept for backward compatibility
// Main layout logic has been moved to AdminRoutes.jsx
import React from "react"
import { Outlet } from "react-router-dom"
import { AdminSidebar } from "../Adminpage/adminsideBar/AdminSidebar"

const AdminLayout = () => {
  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout