import React, { useState, useEffect } from 'react'
import { Student } from '../lib/supabase'
import { StudentService, ExcelService } from '../lib/database'
import { DateUtils, UIUtils } from '../lib/utils'
import { Search, Download, Filter, Users, BookOpen, TrendingUp, Eye } from 'lucide-react'

interface DashboardProps {
  onViewStudent?: (student: Student) => void
}

const Dashboard: React.FC<DashboardProps> = ({ onViewStudent }) => {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [statistics, setStatistics] = useState<Record<string, number>>({})

  const classOptions = [
    { value: '', label: 'همه کلاس‌ها' },
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

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [students, searchQuery, selectedClass])

  const loadData = async () => {
    try {
      setLoading(true)
      const [studentsData, statsData] = await Promise.all([
        StudentService.getAllStudents(),
        StudentService.getClassStatistics()
      ])
      setStudents(studentsData)
      setStatistics(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
      UIUtils.showToast('خطا در بارگذاری اطلاعات', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filterStudents = () => {
    let filtered = students

    // Filter by class
    if (selectedClass) {
      filtered = filtered.filter(student => student.class_name === selectedClass)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(student =>
        student.first_name.toLowerCase().includes(query) ||
        student.last_name.toLowerCase().includes(query) ||
        student.father_name.toLowerCase().includes(query) ||
        student.national_id.includes(query)
      )
    }

    setFilteredStudents(filtered)
  }

  const handleExportExcel = () => {
    try {
      const reportData = ExcelService.generateStudentReportData(filteredStudents)
      const filename = `students_report_${new Date().toISOString().split('T')[0]}.xlsx`
      ExcelService.exportToExcel(reportData, filename)
      UIUtils.showToast('فایل اکسل با موفقیت دانلود شد', 'success')
    } catch (error) {
      console.error('Error exporting Excel:', error)
      UIUtils.showToast('خطا در دانلود فایل اکسل', 'error')
    }
  }

  const totalStudents = students.length
  const getClassColor = (className: string) => {
    const colors = {
      '701': 'bg-blue-100 text-blue-800',
      '702': 'bg-green-100 text-green-800',
      '703': 'bg-purple-100 text-purple-800',
      '801': 'bg-red-100 text-red-800',
      '802': 'bg-yellow-100 text-yellow-800',
      '803': 'bg-indigo-100 text-indigo-800',
      '804': 'bg-pink-100 text-pink-800',
      '805': 'bg-gray-100 text-gray-800',
      '806': 'bg-orange-100 text-orange-800',
      '807': 'bg-teal-100 text-teal-800'
    }
    return colors[className as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6" />
          داشبورد مدیریت دانش‌آموزان
        </h1>
        <p className="text-blue-100">مدیریت و پیگیری اطلاعات دانش‌آموزان مدرسه هیات امنایی نخبگان</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">کل دانش‌آموزان</p>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">تعداد کلاس‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(statistics).length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">میانگین در هر کلاس</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(statistics).length > 0 ? Math.round(totalStudents / Object.keys(statistics).length) : 0}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">نتایج جستجو</p>
              <p className="text-2xl font-bold text-gray-900">{filteredStudents.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Search className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Class Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          آمار کلاس‌ها
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(statistics).map(([className, count]) => (
            <div key={className} className={`rounded-lg p-3 ${getClassColor(className)}`}>
              <div className="text-center">
                <p className="font-semibold">{className}</p>
                <p className="text-sm">{count} نفر</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو بر اساس نام، نام خانوادگی، نام پدر یا کد ملی..."
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Class Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="appearance-none pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[150px]"
              >
                {classOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            دانلود اکسل
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            لیست دانش‌آموزان ({filteredStudents.length} نفر)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام و نام خانوادگی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  نام پدر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کد ملی
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  کلاس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاریخ ثبت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {student.first_name} {student.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.father_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.national_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClassColor(student.class_name)}`}>
                      {student.class_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.created_at ? DateUtils.formatPersianDate(student.created_at) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onViewStudent?.(student)}
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      مشاهده
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">هیچ دانش‌آموزی یافت نشد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard