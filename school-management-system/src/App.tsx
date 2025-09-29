import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import StudentForm from './components/StudentForm'
import Dashboard from './components/Dashboard'
import TrackingSystem from './components/TrackingSystem'
import StudentDetails from './components/StudentDetails'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { Student } from './lib/supabase'
import './App.css'

// App content component to handle routing
const AppContent: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isStudentDetailsOpen, setIsStudentDetailsOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Determine active tab from current route
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname === '/dashboard') return 'dashboard'
    if (pathname === '/tracking') return 'tracking'
    if (pathname === '/login') return 'login'
    return 'register'
  }
  
  const [activeTab, setActiveTab] = useState(getActiveTabFromPath(location.pathname))
  
  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath(location.pathname))
  }, [location.pathname])
  
  // Handle tab navigation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'tracking':
        navigate('/tracking')
        break
      case 'login':
        navigate('/login')
        break
      default:
        navigate('/')
        break
    }
  }

  const handleStudentRegistered = () => {
    // Trigger refresh for other components
    setRefreshTrigger(prev => prev + 1)
  }

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student)
    setIsStudentDetailsOpen(true)
  }

  const handleCloseStudentDetails = () => {
    setIsStudentDetailsOpen(false)
    setSelectedStudent(null)
  }

  const handleDataUpdated = () => {
    setRefreshTrigger(prev => prev + 1)
  }
  
  const handleLoginSuccess = () => {
    navigate('/dashboard')
  }
  
  // Don't show header on login page
  const showHeader = location.pathname !== '/login'

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
      )}
      
      <main className={showHeader ? "py-8" : ""}>
        <Routes>
          <Route path="/" element={<StudentForm onSuccess={handleStudentRegistered} />} />
          <Route path="/login" element={<Login onSuccess={handleLoginSuccess} />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard 
                  key={refreshTrigger} 
                  onViewStudent={handleViewStudent}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tracking" 
            element={
              <ProtectedRoute>
                <TrackingSystem 
                  key={refreshTrigger}
                  onDataUpdated={handleDataUpdated}
                />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Student Details Modal */}
      <StudentDetails
        student={selectedStudent}
        isOpen={isStudentDetailsOpen}
        onClose={handleCloseStudentDetails}
      />

      {/* Footer - only show on non-login pages */}
      {showHeader && (
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                <img 
                  src="/logo.jpg" 
                  alt="لوگو مدرسه" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-lg font-semibold text-gray-900">
                  مدرسه هیات امنایی نخبگان
                </span>
              </div>
              <p className="text-sm text-gray-600">
                سیستم مدیریت اطلاعات دانش‌آموزان - سال تحصیلی ۱۴۰۴-۱۴۰۵
              </p>
              <p className="text-xs text-gray-500 mt-2">
                طراحی و توسعه با عشق برای آموزش بهتر دانش‌آموزان
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

// Main App component with Router and AuthProvider
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App