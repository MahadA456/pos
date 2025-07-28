"use client"

import type React from "react"

import Header from "./Header"
import Navigation from "./Navigation"

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: string;
  status: string;
  assignedStations: string[];
  createdAt: string;
  station: {
    id: string;
    name: string;
    location: string;
    status: string;
    ipAddress: string;
    printerName: string;
    cashDrawer: string;
  };
  loginTime: string;
  rememberMe: boolean;
}

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Layout({ children, user, onLogout, currentPage, onPageChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <div className="flex">
        <Navigation user={user} currentPage={currentPage} onPageChange={onPageChange} />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
