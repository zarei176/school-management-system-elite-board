import React from 'react'
import { School, GraduationCap, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { UIUtils } from '../lib/utils'

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { isAuthenticated, logout, user } = useAuth()
  
  const publicTabs = [
    { id: 'register', label: 'ثبت‌نام دانش‌آموز', icon: GraduationCap }
  ]
  
  const adminTabs = [
    { id: 'register', label: 'ثبت‌نام دانش‌آموز', icon: GraduationCap },
    { id: 'dashboard', label: 'داشبورد مدیریت', icon: School },
    { id: 'tracking', label: 'مقایسه و پیگیری', icon: School }
  ]
  
  const tabs = isAuthenticated ? adminTabs : publicTabs
  
  const handleLogout = () => {
    logout()
    onTabChange('register')
    UIUtils.showToast('با موفقیت از سیستم خارج شدید', 'success')
  }

  return (
    <header className="bg-white shadow-lg border-b-4 border-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* School branding */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4 space-x-reverse">
            <img 
              src="/logo.jpg" 
              alt="لوگو مدرسه" 
              className="h-16 w-16 object-contain rounded-lg shadow-md"
            />
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">
                مدرسه هیات امنایی نخبگان
              </h1>
              <p className="text-sm text-blue-600 font-medium mt-1">
                با دانش و ایمان، فاتح میدان باش ...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                سال تحصیلی ۱۴۰۴-۱۴۰۵
              </p>
            </div>
          </div>
          
          <div className="text-left">
            <p className="text-lg font-bold text-gray-900">
              سیستم مدیریت اطلاعات دانش‌آموزان
            </p>
            <p className="text-sm text-gray-600">
              مدیریت و پیگیری ثبت‌نام دانش‌آموزان
            </p>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 space-x-reverse">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>
            
            {/* Authentication Section */}
            <div className="flex items-center space-x-4 space-x-reverse">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.username}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>خروج</span>
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ورود مدیر</span>
                </a>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header