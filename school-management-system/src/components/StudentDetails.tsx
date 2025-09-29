import React from 'react'
import { Student } from '../lib/supabase'
import { DateUtils } from '../lib/utils'
import { X, User, Phone, MapPin, AlertCircle, Calendar, GraduationCap } from 'lucide-react'

interface StudentDetailsProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

const StudentDetails: React.FC<StudentDetailsProps> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null

  const getClassColor = (className: string) => {
    const colors = {
      '701': 'bg-blue-100 text-blue-800 border-blue-200',
      '702': 'bg-green-100 text-green-800 border-green-200',
      '703': 'bg-purple-100 text-purple-800 border-purple-200',
      '801': 'bg-red-100 text-red-800 border-red-200',
      '802': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      '803': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      '804': 'bg-pink-100 text-pink-800 border-pink-200',
      '805': 'bg-gray-100 text-gray-800 border-gray-200',
      '806': 'bg-orange-100 text-orange-800 border-orange-200',
      '807': 'bg-teal-100 text-teal-800 border-teal-200'
    }
    return colors[className as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3 mr-10">
            <User className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">
                {student.first_name} {student.last_name}
              </h2>
              <p className="text-blue-100 text-sm">جزئیات دانش‌آموز</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              اطلاعات شخصی
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">نام</label>
                  <p className="text-gray-900 font-medium">{student.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">نام خانوادگی</label>
                  <p className="text-gray-900 font-medium">{student.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">نام پدر</label>
                  <p className="text-gray-900 font-medium">{student.father_name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">کد ملی</label>
                  <p className="text-gray-900 font-medium font-mono">{student.national_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">کلاس</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getClassColor(student.class_name)}`}>
                    <GraduationCap className="w-4 h-4 ml-1" />
                    {student.class_name}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">تاریخ ثبت‌نام</label>
                  <p className="text-gray-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    {student.created_at ? DateUtils.formatPersianDateTime(student.created_at) : 'نامشخص'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Parents Information */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              اطلاعات والدین
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">شغل پدر</label>
                <p className="text-gray-900">{student.father_job || 'ذکر نشده'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">شغل مادر</label>
                <p className="text-gray-900">{student.mother_job || 'ذکر نشده'}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              اطلاعات تماس
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">تلفن پدر</label>
                <p className="text-gray-900 font-mono">
                  {student.father_phone ? (
                    <a href={`tel:${student.father_phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {student.father_phone}
                    </a>
                  ) : (
                    'ذکر نشده'
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">تلفن مادر</label>
                <p className="text-gray-900 font-mono">
                  {student.mother_phone ? (
                    <a href={`tel:${student.mother_phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {student.mother_phone}
                    </a>
                  ) : (
                    'ذکر نشده'
                  )}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">تلفن دانش‌آموز</label>
                <p className="text-gray-900 font-mono">
                  {student.student_phone ? (
                    <a href={`tel:${student.student_phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                      {student.student_phone}
                    </a>
                  ) : (
                    'ذکر نشده'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              آدرس منزل
            </h3>
            <p className="text-gray-900 leading-relaxed">
              {student.home_address || 'آدرس ذکر نشده'}
            </p>
          </div>

          {/* Special Illness */}
          {student.special_illness && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                بیماری یا حساسیت خاص
              </h3>
              <p className="text-gray-900 leading-relaxed">{student.special_illness}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetails