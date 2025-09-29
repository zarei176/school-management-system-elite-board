# سیستم مدیریت مدرسه هیات امنایی نخبگان

## درباره پروژه

این پروژه یک سیستم مدیریت مدرسه پیشرفته است که برای مدرسه هیات امنایی نخبگان طراحی شده است. این سیستم امکانات کاملی برای مدیریت دانش‌آموزان، ثبت‌نام، احراز هویت و پنل مدیریت ارائه می‌دهد.

## لینک اجرای مستقیم

🌐 **آدرس آنلاین پروژه:** https://tc9xqhmatpz4.space.minimax.io

## ویژگی‌های کلیدی

### ✨ ویژگی‌های اصلی

- 🔐 **سیستم احراز هویت امن** - ورود و خروج مدیران با Supabase Auth
- 👥 **مدیریت دانش‌آموزان** - ثبت، ویرایش و حذف اطلاعات دانش‌آموزان
- 📊 **پنل مدیریت پیشرفته** - داشبورد جامع برای نمایش آمار و اطلاعات
- 📝 **فرم ثبت‌نام هوشمند** - ثبت‌نام آنلاین دانش‌آموزان با اعتبارسنجی
- 🔍 **سیستم جستجو و فیلتر** - جستجو بر اساس نام، کلاس و سایر معیارها
- 📋 **مدیریت فایل‌های اکسل** - آپلود و پردازش فایل‌های Excel
- 📱 **طراحی ریسپانسیو** - سازگار با تمام دستگاه‌ها
- 🎨 **رابط کاربری مدرن** - طراحی زیبا با TailwindCSS

### 🛡️ امنیت و کنترل دسترسی

- احراز هویت چند مرحله‌ای
- محدودیت دسترسی بر اساس نقش کاربر
- امنیت داده‌ها در Supabase
- اعتبارسنجی ورودی‌ها

## تکنولوژی‌های استفاده شده

### Frontend
- ⚛️ **React 18** - کتابخانه UI
- 🔷 **TypeScript** - تایپ اسکریپت برای بهبود کیفیت کد
- ⚡ **Vite** - ابزار build سریع
- 🎨 **TailwindCSS** - فریمورک CSS
- 🧩 **Radix UI** - کامپوننت‌های UI دسترسی‌پذیر
- 📋 **React Hook Form** - مدیریت فرم‌ها
- 🎯 **Zod** - اعتبارسنجی schema

### Backend & Database
- 🗄️ **Supabase** - Backend as a Service
- 🐘 **PostgreSQL** - پایگاه داده
- 🔐 **Supabase Auth** - سیستم احراز هویت
- 📦 **Supabase Storage** - ذخیره‌سازی فایل

### DevOps & Tools
- 📦 **pnpm** - مدیر بسته‌ها
- 🔧 **ESLint** - linting کد
- 📐 **PostCSS** - پردازشگر CSS

## ساختار پروژه

```
school-management-system/
├── src/
│   ├── components/          # کامپوننت‌های React
│   │   ├── Dashboard.tsx    # داشبورد مدیریت
│   │   ├── Login.tsx        # صفحه ورود
│   │   ├── StudentForm.tsx  # فرم ثبت‌نام دانش‌آموز
│   │   ├── StudentDetails.tsx # جزئیات دانش‌آموز
│   │   └── ...
│   ├── contexts/            # Context API
│   │   └── AuthContext.tsx  # مدیریت وضعیت احراز هویت
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # کتابخانه‌ها و utilities
│   │   ├── supabase.ts      # کانفیگ Supabase
│   │   ├── database.ts      # عملیات پایگاه داده
│   │   └── utils.ts         # توابع کمکی
│   ├── App.tsx              # کامپوننت اصلی
│   └── main.tsx             # نقطه ورود
├── public/                  # فایل‌های عمومی
├── supabase/               # اسکریپت‌های پایگاه داده
│   └── tables/             # جداول SQL
└── dist/                   # فایل‌های build شده
```

## نصب و راه‌اندازی

### پیش‌نیازها

- Node.js (نسخه 18 یا بالاتر)
- pnpm
- حساب Supabase

### گام‌های نصب

1. **کلون کردن repository:**
```bash
git clone [URL این repository]
cd school-management-system
```

2. **نصب dependencies:**
```bash
pnpm install
```

3. **تنظیم متغیرهای محیطی:**
```bash
cp .env.example .env.local
```

فایل `.env.local` را ویرایش کنید:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **راه‌اندازی پایگاه داده:**

جداول مورد نیاز را در Supabase ایجاد کنید:

```sql
-- جدول مدیران
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- جدول دانش‌آموزان
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100),
    national_id VARCHAR(10) UNIQUE,
    birth_date DATE,
    grade VARCHAR(20),
    field VARCHAR(50),
    phone VARCHAR(15),
    address TEXT,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active'
);

-- جدول دانش‌آموزان مورد انتظار
CREATE TABLE expected_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    father_name VARCHAR(100),
    national_id VARCHAR(10) UNIQUE,
    birth_date DATE,
    grade VARCHAR(20),
    field VARCHAR(50),
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **اجرای پروژه:**
```bash
pnpm dev
```

6. **Build برای production:**
```bash
pnpm build
```

## استفاده از سیستم

### ورود مدیر
1. به آدرس `/login` بروید
2. ایمیل و رمز عبور مدیر را وارد کنید
3. پس از ورود موفق، به داشبورد منتقل می‌شوید

### مدیریت دانش‌آموزان
1. در داشبورد، بخش "دانش‌آموزان" را انتخاب کنید
2. امکان مشاهده، ویرایش و حذف دانش‌آموزان
3. جستجو و فیلتر بر اساس معیارهای مختلف

### ثبت‌نام دانش‌آموز جدید
1. فرم ثبت‌نام را پر کنید
2. تمام فیلدهای اجباری را تکمیل نمایید
3. سیستم خودکار اعتبارسنجی انجام می‌دهد

## ساختار پایگاه داده

### جداول اصلی

1. **admin_users** - اطلاعات مدیران سیستم
2. **students** - اطلاعات دانش‌آموزان ثبت‌نام شده
3. **expected_students** - لیست دانش‌آموزان مورد انتظار

## امنیت

- تمام API calls از طریق Supabase RLS (Row Level Security) محافظت می‌شوند
- احراز هویت JWT-based
- اعتبارسنجی ورودی در سمت client و server
- HTTPS برای تمام ارتباطات

## مشارکت در پروژه

1. Fork کنید
2. یک branch جدید ایجاد کنید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add some amazing feature'`)
4. Push به branch کنید (`git push origin feature/amazing-feature`)
5. Pull Request ایجاد کنید

## لایسنس

این پروژه تحت لایسنس MIT قرار دارد.

## پشتیبانی

برای هرگونه سوال یا مشکل، لطفاً یک issue در GitHub ایجاد کنید.

---

**توسعه یافته برای مدرسه هیات امنایی نخبگان**

**تاریخ آخرین بروزرسانی:** مهر ۱۴۰۳