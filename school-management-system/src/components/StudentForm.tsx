import React, { useState } from 'react'
import { Student } from '../lib/supabase'
import { StudentService } from '../lib/database'
import { ValidationUtils, UIUtils } from '../lib/utils'
import { Save, User, Phone, MapPin, AlertCircle } from 'lucide-react'

interface StudentFormProps {
  onSuccess?: () => void
}

const StudentForm: React.FC<StudentFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'created_at' | 'updated_at'>>({
    first_name: '',
    last_name: '',
    father_name: '',
    father_job: '',
    mother_job: '',
    national_id: '',
    home_address: '',
    special_illness: '',
    father_phone: '',
    mother_phone: '',
    student_phone: '',
    class_name: ''
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const classOptions = [
    { value: '701', label: '۷۰۱' },
    { value: '702', label: '۷۰۲' },
    { value: '703', label: '۷۰۳' },
    { value: '801', label: '۸۰۱' },
    { value: '802', label: '۸۰۲' },
    { value: '803', label: '۸۰۳' },
    { value: '804', label: '۸۰۴' },
    { value: '805', label: '۸۰۵' },
    { value: '806', label: '۸۰۶' },
    { value: '807', label: '۸۰۷' }
  ]

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof Student, string>> = {}

    // Required fields
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'نام الزامی است'
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'نام خانوادگی الزامی است'
    }
    if (!formData.father_name.trim()) {
      newErrors.father_name = 'نام پدر الزامی است'
    }
    if (!formData.national_id.trim()) {
      newErrors.national_id = 'کد ملی الزامی است'
    } else if (!ValidationUtils.validateNationalId(formData.national_id)) {
      newErrors.national_id = 'کد ملی معتبر نیست'
    }
    if (!formData.class_name) {
      newErrors.class_name = 'انتخاب کلاس الزامی است'
    }

    // Phone number validation
    if (formData.father_phone && !ValidationUtils.validatePhoneNumber(formData.father_phone)) {
      newErrors.father_phone = 'شماره تلفن پدر معتبر نیست'
    }
    if (formData.mother_phone && !ValidationUtils.validatePhoneNumber(formData.mother_phone)) {
      newErrors.mother_phone = 'شماره تلفن مادر معتبر نیست'
    }
    if (formData.student_phone && !ValidationUtils.validatePhoneNumber(formData.student_phone)) {
      newErrors.student_phone = 'شماره تلفن دانش‌آموز معتبر نیست'
    }

    // Check if national ID already exists
    if (!newErrors.national_id) {
      try {
        const exists = await StudentService.checkNationalIdExists(formData.national_id)
        if (exists) {
          newErrors.national_id = 'این کد ملی قبلاً ثبت شده است'
        }
      } catch (error) {
        console.error('Error checking national ID:', error)
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isValid = await validateForm()
    if (!isValid) {
      UIUtils.showToast('لطفاً خطاهای فرم را برطرف کنید', 'error')
      return
    }

    setIsSubmitting(true)
    try {
      // Sanitize and format data
      const sanitizedData = {
        ...formData,
        first_name: ValidationUtils.sanitizeInput(formData.first_name),
        last_name: ValidationUtils.sanitizeInput(formData.last_name),
        father_name: ValidationUtils.sanitizeInput(formData.father_name),
        father_job: ValidationUtils.sanitizeInput(formData.father_job || ''),
        mother_job: ValidationUtils.sanitizeInput(formData.mother_job || ''),
        home_address: ValidationUtils.sanitizeInput(formData.home_address || ''),
        special_illness: ValidationUtils.sanitizeInput(formData.special_illness || ''),
        father_phone: ValidationUtils.formatPhoneNumber(formData.father_phone || ''),
        mother_phone: ValidationUtils.formatPhoneNumber(formData.mother_phone || ''),
        student_phone: ValidationUtils.formatPhoneNumber(formData.student_phone || '')
      }

      await StudentService.createStudent(sanitizedData)
      UIUtils.showToast('اطلاعات دانش‌آموز با موفقیت ثبت شد', 'success')
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        father_name: '',
        father_job: '',
        mother_job: '',
        national_id: '',
        home_address: '',
        special_illness: '',
        father_phone: '',
        mother_phone: '',
        student_phone: '',
        class_name: ''
      })
      setErrors({})
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating student:', error)
      UIUtils.showToast('خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof Student, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            فرم ثبت اطلاعات دانش‌آموز
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="نام دانش‌آموز"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.first_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام خانوادگی *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="نام خانوادگی"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.last_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام پدر *
              </label>
              <input
                type="text"
                value={formData.father_name}
                onChange={(e) => handleInputChange('father_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.father_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="نام پدر"
              />
              {errors.father_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.father_name}
                </p>
              )}
            </div>
          </div>

          {/* Parents' Jobs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شغل پدر
              </label>
              <input
                type="text"
                value={formData.father_job}
                onChange={(e) => handleInputChange('father_job', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="شغل پدر"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شغل مادر
              </label>
              <input
                type="text"
                value={formData.mother_job}
                onChange={(e) => handleInputChange('mother_job', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="شغل مادر"
              />
            </div>
          </div>

          {/* National ID and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کد ملی *
              </label>
              <input
                type="text"
                value={formData.national_id}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  handleInputChange('national_id', value)
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.national_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="کد ملی ۱۰ رقمی"
                maxLength={10}
              />
              {errors.national_id && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.national_id}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کلاس *
              </label>
              <select
                value={formData.class_name}
                onChange={(e) => handleInputChange('class_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.class_name ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">انتخاب کلاس</option>
                {classOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.class_name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.class_name}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline ml-1" />
              آدرس منزل
            </label>
            <textarea
              value={formData.home_address}
              onChange={(e) => handleInputChange('home_address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="آدرس کامل منزل"
              rows={3}
            />
          </div>

          {/* Special Illness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <AlertCircle className="w-4 h-4 inline ml-1" />
              بیماری خاص
            </label>
            <textarea
              value={formData.special_illness}
              onChange={(e) => handleInputChange('special_illness', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="در صورت وجود بیماری خاص یا حساسیت، ذکر کنید"
              rows={2}
            />
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline ml-1" />
                شماره همراه پدر
              </label>
              <input
                type="tel"
                value={formData.father_phone}
                onChange={(e) => handleInputChange('father_phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.father_phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="09xxxxxxxxx"
              />
              {errors.father_phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.father_phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline ml-1" />
                شماره همراه مادر
              </label>
              <input
                type="tel"
                value={formData.mother_phone}
                onChange={(e) => handleInputChange('mother_phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.mother_phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="09xxxxxxxxx"
              />
              {errors.mother_phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.mother_phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline ml-1" />
                شماره همراه دانش‌آموز
              </label>
              <input
                type="tel"
                value={formData.student_phone}
                onChange={(e) => handleInputChange('student_phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.student_phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="09xxxxxxxxx"
              />
              {errors.student_phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.student_phone}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'در حال ثبت...' : 'ثبت اطلاعات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudentForm