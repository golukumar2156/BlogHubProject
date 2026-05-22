import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import Sidebar from "../Sidebar"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🔒" },
  ]

  return (
    <div className="flex bg-background">
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="h-16 border-b border-border/50 flex items-center px-6 md:px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-w-4xl">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 border-b-2 smooth-transition ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-6">Personal Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input defaultValue="Alex Johnson" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input defaultValue="alex@example.com" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bio</label>
                    <textarea
                      rows={4}
                      defaultValue="A passionate writer and developer..."
                      className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 resize-none outline-none focus:border-primary"
                    />
                  </div>

                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Save Changes
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-6">Profile Picture</h3>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-foreground">AJ</span>
                  </div>
                  <div>
                    <Button variant="outline" className="mb-2">
                      Upload New
                    </Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: "New Comments", desc: "Get notified when someone comments" },
                  { label: "New Followers", desc: "Receive updates when someone follows you" },
                  { label: "Weekly Digest", desc: "Weekly blog summary" },
                  { label: "New Messages", desc: "Be notified of new messages" },
                ].map((n) => (
                  <div key={n.label} className="flex justify-between items-center p-4 rounded-lg hover:bg-muted/30">
                    <div>
                      <p className="font-medium">{n.label}</p>
                      <p className="text-sm text-muted-foreground">{n.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-6">Change Password</h3>
                <div className="space-y-4">
                  <Input type="password" placeholder="Current Password" />
                  <Input type="password" placeholder="New Password" />
                  <Input type="password" placeholder="Confirm Password" />
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    Update Password
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">Two-Factor Authentication</h3>
                <p className="text-muted-foreground mb-4">
                  Secure your account with 2FA
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
