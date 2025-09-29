import { Student, ExpectedStudent, supabase } from './supabase'
import * as XLSX from 'xlsx'

// Database operations for Students
export class StudentService {
  static async createStudent(student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('students')
      .insert([{
        ...student,
        updated_at: new Date().toISOString()
      }])
      .select()
      .maybeSingle()

    if (error) throw error
    return data
  }

  static async getAllStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getStudentsByClass(className: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('class_name', className)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async searchStudents(query: string) {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,national_id.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async checkNationalIdExists(nationalId: string) {
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .eq('national_id', nationalId)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }

  static async getClassStatistics() {
    const { data, error } = await supabase
      .from('students')
      .select('class_name')

    if (error) throw error
    
    const stats: Record<string, number> = {}
    data?.forEach(student => {
      stats[student.class_name] = (stats[student.class_name] || 0) + 1
    })
    
    return stats
  }
}

// Database operations for Expected Students
export class ExpectedStudentService {
  static async uploadExpectedStudents(students: Omit<ExpectedStudent, 'id' | 'created_at'>[], sessionId: string) {
    // Clear previous data for this session
    await supabase
      .from('expected_students')
      .delete()
      .eq('upload_session_id', sessionId)

    const studentsWithSession = students.map(student => ({
      ...student,
      upload_session_id: sessionId
    }))

    const { data, error } = await supabase
      .from('expected_students')
      .insert(studentsWithSession)
      .select()

    if (error) throw error
    return data
  }

  static async getExpectedStudents(sessionId?: string) {
    let query = supabase
      .from('expected_students')
      .select('*')

    if (sessionId) {
      query = query.eq('upload_session_id', sessionId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async getUnregisteredStudents(sessionId: string) {
    // Get expected students for this session
    const expectedStudents = await this.getExpectedStudents(sessionId)
    
    // Get all registered students
    const registeredStudents = await StudentService.getAllStudents()
    const registeredNationalIds = new Set(registeredStudents.map(s => s.national_id))
    
    // Find unregistered students
    const unregistered = expectedStudents.filter(
      expected => !registeredNationalIds.has(expected.national_id)
    )
    
    return unregistered
  }

  static async updateRegistrationStatus(sessionId: string) {
    const expectedStudents = await this.getExpectedStudents(sessionId)
    const registeredStudents = await StudentService.getAllStudents()
    const registeredNationalIds = new Set(registeredStudents.map(s => s.national_id))
    
    for (const expected of expectedStudents) {
      const isRegistered = registeredNationalIds.has(expected.national_id)
      
      await supabase
        .from('expected_students')
        .update({ is_registered: isRegistered })
        .eq('id', expected.id!)
    }
  }
}

// Excel file processing utilities
export class ExcelService {
  static parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('خطا در خواندن فایل'))
      reader.readAsArrayBuffer(file)
    })
  }

  static exportToExcel(data: any[], filename: string) {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    XLSX.writeFile(workbook, filename)
  }

  static generateStudentReportData(students: Student[]) {
    return students.map(student => ({
      'نام': student.first_name,
      'نام خانوادگی': student.last_name,
      'نام پدر': student.father_name,
      'شغل پدر': student.father_job || '',
      'شغل مادر': student.mother_job || '',
      'کد ملی': student.national_id,
      'آدرس': student.home_address || '',
      'بیماری خاص': student.special_illness || '',
      'تلفن پدر': student.father_phone || '',
      'تلفن مادر': student.mother_phone || '',
      'تلفن دانش‌آموز': student.student_phone || '',
      'کلاس': student.class_name,
      'تاریخ ثبت‌نام': student.created_at ? new Date(student.created_at).toLocaleDateString('fa-IR') : ''
    }))
  }

  static generateUnregisteredReportData(students: ExpectedStudent[]) {
    return students.map(student => ({
      'نام': student.first_name,
      'نام خانوادگی': student.last_name,
      'کد ملی': student.national_id,
      'کلاس': student.class_name,
      'وضعیت': 'ثبت‌نام نشده'
    }))
  }
}