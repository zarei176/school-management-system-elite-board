import React, { useState, useRef } from 'react'
import { ExpectedStudent } from '../lib/supabase'
import { ExpectedStudentService, ExcelService } from '../lib/database'
import { UIUtils, ValidationUtils } from '../lib/utils'
import { Upload, FileSpreadsheet, Users, AlertTriangle, Download, RefreshCw } from 'lucide-react'

interface TrackingSystemProps {
  onDataUpdated?: () => void
}

const TrackingSystem: React.FC<TrackingSystemProps> = ({ onDataUpdated }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedStudents, setUploadedStudents] = useState<ExpectedStudent[]>([])
  const [unregisteredStudents, setUnregisteredStudents] = useState<ExpectedStudent[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isComparing, setIsComparing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      UIUtils.showToast('لطفاً فقط فایل‌های اکسل آپلود کنید', 'error')
      return
    }

    setIsUploading(true)
    try {
      // Parse Excel file
      const excelData = await ExcelService.parseExcelFile(file)
      
      if (!excelData || excelData.length === 0) {
        throw new Error('فایل خالی است')
      }

      // Map Excel data to expected students format
      const expectedStudents: Omit<ExpectedStudent, 'id' | 'created_at'>[] = []
      const errors: string[] = []

      excelData.forEach((row: any, index: number) => {
        try {
          // Handle different possible column names (both English and Persian)
          const firstName = row['نام'] || row['first_name'] || row['FirstName'] || row['نام کوچک'] || ''
          const lastName = row['نام خانوادگی'] || row['last_name'] || row['LastName'] || row['نام فامیل'] || ''
          const nationalId = String(row['کد ملی'] || row['national_id'] || row['NationalId'] || row['شناسه ملی'] || '').replace(/\D/g, '')
          const className = String(row['کلاس'] || row['class'] || row['Class'] || row['کلاس تحصیلی'] || '')

          // Validate required fields
          if (!firstName || !lastName || !nationalId || !className) {
            errors.push(`ردیف ${index + 2}: فیلدهای الزامی کامل نیست`)
            return
          }

          // Validate national ID
          if (nationalId.length !== 10 || !ValidationUtils.validateNationalId(nationalId)) {
            errors.push(`ردیف ${index + 2}: کد ملی معتبر نیست`)
            return
          }

          // Validate class
          if (!ValidationUtils.isValidClass(className)) {
            errors.push(`ردیف ${index + 2}: کلاس معتبر نیست`)
            return
          }

          expectedStudents.push({
            first_name: ValidationUtils.sanitizeInput(firstName),
            last_name: ValidationUtils.sanitizeInput(lastName),
            national_id: nationalId,
            class_name: className,
            is_registered: false
          })
        } catch (error) {
          errors.push(`ردیف ${index + 2}: خطا در پردازش داده`)
        }
      })

      if (errors.length > 0 && expectedStudents.length === 0) {
        throw new Error('هیچ رکورد معتبری یافت نشد:\n' + errors.slice(0, 5).join('\n'))
      }

      // Upload to database
      const sessionId = UIUtils.generateSessionId()
      const uploadedData = await ExpectedStudentService.uploadExpectedStudents(expectedStudents, sessionId)
      
      setUploadedStudents(uploadedData)
      setCurrentSessionId(sessionId)
      setUnregisteredStudents([])
      
      UIUtils.showToast(
        `${expectedStudents.length} دانش‌آموز با موفقیت آپلود شد${errors.length > 0 ? ` (${errors.length} خطا)` : ''}`,
        errors.length > 0 ? 'info' : 'success'
      )

      if (onDataUpdated) {
        onDataUpdated()
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      UIUtils.showToast(
        error instanceof Error ? error.message : 'خطا در آپلود فایل',
        'error'
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCompareData = async () => {
    if (!currentSessionId) {
      UIUtils.showToast('ابتدا فایل لیست دانش‌آموزان را آپلود کنید', 'error')
      return
    }

    setIsComparing(true)
    try {
      // Update registration status
      await ExpectedStudentService.updateRegistrationStatus(currentSessionId)
      
      // Get unregistered students
      const unregistered = await ExpectedStudentService.getUnregisteredStudents(currentSessionId)
      setUnregisteredStudents(unregistered)
      
      UIUtils.showToast(
        `مقایسه انجام شد. ${unregistered.length} دانش‌آموز ثبت‌نام نکرده‌اند`,
        'success'
      )
    } catch (error) {
      console.error('Error comparing data:', error)
      UIUtils.showToast('خطا در مقایسه اطلاعات', 'error')
    } finally {
      setIsComparing(false)
    }
  }

  const handleExportUnregistered = () => {
    if (unregisteredStudents.length === 0) {
      UIUtils.showToast('هیچ دانش‌آموز ثبت‌نام نکرده‌ای یافت نشد', 'info')
      return
    }

    try {
      const reportData = ExcelService.generateUnregisteredReportData(unregisteredStudents)
      const filename = `unregistered_students_${new Date().toISOString().split('T')[0]}.xlsx`
      ExcelService.exportToExcel(reportData, filename)
      UIUtils.showToast('فایل دانش‌آموزان ثبت‌نام نکرده دانلود شد', 'success')
    } catch (error) {
      console.error('Error exporting unregistered:', error)
      UIUtils.showToast('خطا در دانلود فایل', 'error')
    }
  }

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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-6 h-6" />
          سیستم مقایسه و پیگیری
        </h1>
        <p className="text-orange-100">
          آپلود فهرست دانش‌آموزان مورد انتظار و شناسایی آنهایی که هنوز ثبت‌نام نکرده‌اند
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          آپلود فایل لیست دانش‌آموزان
        </h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            فایل اکسل را انتخاب کنید
          </h3>
          <p className="text-gray-600 mb-4">
            فایل باید شامل ستون‌های: نام، نام خانوادگی، کد ملی، کلاس باشد
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'در حال آپلود...' : 'انتخاب فایل'}
          </button>
        </div>
      </div>

      {/* Uploaded Data Summary */}
      {uploadedStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            خلاصه فایل آپلود شده
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 font-semibold">کل دانش‌آموزان</p>
              <p className="text-2xl font-bold text-blue-800">{uploadedStudents.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-600 font-semibold">آماده مقایسه</p>
              <p className="text-2xl font-bold text-green-800">بله</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-orange-600 font-semibold">وضعیت</p>
              <p className="text-2xl font-bold text-orange-800">
                {unregisteredStudents.length > 0 ? 'مقایسه شده' : 'آماده'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleCompareData}
            disabled={isComparing}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isComparing ? 'animate-spin' : ''}`} />
            {isComparing ? 'در حال مقایسه...' : 'مقایسه با داتابیس'}
          </button>
        </div>
      )}

      {/* Unregistered Students */}
      {unregisteredStudents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-red-50 border-b border-red-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                دانش‌آموزان ثبت‌نام نکرده ({unregisteredStudents.length} نفر)
              </h2>
              <button
                onClick={handleExportUnregistered}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                دانلود فهرست
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نام و نام خانوادگی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کد ملی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کلاس
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unregisteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </div>
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
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ثبت‌نام نشده
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No unregistered students message */}
      {uploadedStudents.length > 0 && unregisteredStudents.length === 0 && currentSessionId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-green-600 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">
            تبریک! همه دانش‌آموزان ثبت‌نام کرده‌اند
          </h3>
          <p className="text-green-700">
            هیچ دانش‌آموزی در فهرست غایبین یافت نشد
          </p>
        </div>
      )}
    </div>
  )
}

export default TrackingSystem