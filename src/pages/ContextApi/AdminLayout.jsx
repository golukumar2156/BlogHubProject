// Layout wrapper to include sidebar
import React from "react"
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { AdminSidebar } from "../Adminpage/adminsideBar/AdminSidebar"
const AdminLayout = () => {
  return (
    <div className="flex bg-background min-h-screen">
      <AdminSidebar/>
      <div className="flex-1 p-6 md:p-8">
        {/* This is where nested routes render */}
        <Outlet />
      </div>
    </div>
  )
}
export default AdminLayout