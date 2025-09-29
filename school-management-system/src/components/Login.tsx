import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UIUtils } from '../lib/utils'
import { LogIn, User, Lock, Eye, EyeOff, School } from 'lucide-react'

interface LoginProps {
  onSuccess?: () => void
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    
    // Validation
    const newErrors: { username?: string; password?: string } = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'نام کاربری الزامی است'
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'رمز عبور الزامی است'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    
    try {
      const success = await login(formData.username, formData.password)
      
      if (success) {
        UIUtils.showToast('ورود موفقیت‌آمیز بود', 'success')
        if (onSuccess) {
          onSuccess()
        }
      } else {
        setErrors({ general: 'نام کاربری یا رمز عبور نادرست است' })
        UIUtils.showToast('نام کاربری یا رمز عبور نادرست است', 'error')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'خطا در ورود به سیستم' })
      UIUtils.showToast('خطا در ورود به سیستم', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* School Branding */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.jpg" 
              alt="لوگو مدرسه" 
              className="h-20 w-20 object-contain rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            مدرسه هیات امنایی نخبگان
          </h1>
          <p className="text-blue-600 font-medium">
            با دانش و ایمان، فاتح میدان باش ...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            سیستم مدیریت اطلاعات دانش‌آموزان
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">ورود مدیر سیستم</h2>
            <p className="text-gray-600 text-sm mt-1">لطفاً اطلاعات احراز هویت خود را وارد کنید</p>
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام کاربری
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="نام کاربری را وارد کنید"
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pr-10 pl-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="رمز عبور را وارد کنید"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  در حال ورود...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  ورود به سیستم
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                سیستم مدیریت اطلاعات دانش‌آموزان
              </p>
              <p className="text-xs text-gray-400 mt-1">
                سال تحصیلی ۱۴۰۴-۱۴۰۵
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <School className="w-4 h-4" />
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login