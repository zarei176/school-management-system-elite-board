// Validation utilities
export class ValidationUtils {
  static validateNationalId(nationalId: string): boolean {
    if (!nationalId || nationalId.length !== 10) return false
    
    // Check if all digits are the same
    if (/^(\d)\1{9}$/.test(nationalId)) return false
    
    // Calculate checksum
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nationalId[i]) * (10 - i)
    }
    
    const remainder = sum % 11
    const checkDigit = parseInt(nationalId[9])
    
    if (remainder < 2) {
      return checkDigit === remainder
    } else {
      return checkDigit === 11 - remainder
    }
  }

  static validatePhoneNumber(phone: string): boolean {
    if (!phone) return true // Optional field
    const phoneRegex = /^(\+98|0)?9\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  static formatPhoneNumber(phone: string): string {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('98')) {
      return '+' + cleaned
    } else if (cleaned.startsWith('0')) {
      return cleaned
    } else if (cleaned.startsWith('9')) {
      return '0' + cleaned
    }
    return phone
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ')
  }

  static isValidClass(className: string): boolean {
    const validClasses = ['701', '702', '703', '801', '802', '803', '804', '805', '806', '807']
    return validClasses.includes(className)
  }
}

// Date utilities
export class DateUtils {
  static formatPersianDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  static formatPersianDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// UI utilities
export class UIUtils {
  static showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    // Simple toast implementation - can be enhanced with a proper toast library
    const toast = document.createElement('div')
    toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`
    toast.textContent = message
    
    document.body.appendChild(toast)
    
    setTimeout(() => {
      toast.remove()
    }, 3000)
  }

  static generateSessionId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }
}