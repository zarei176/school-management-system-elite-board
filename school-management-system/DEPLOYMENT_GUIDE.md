# راهنمای استقرار در GitHub Pages

این راهنما شما را قدم به قدم در استقرار پروژه مدرسه هیات امنایی نخبگان در GitHub Pages همراهی می‌کند.

## ✅ پیش‌نیازها

قبل از شروع، مطمئن شوید که:
- [x] Repository در GitHub موجود است
- [x] اطلاعات Supabase (URL و ANON_KEY) در دسترس است
- [x] Git برای repository پیکربندی شده است

## 🔧 مرحله ۱: تنظیم GitHub Secrets

1. **رفتن به تنظیمات Repository:**
   - به GitHub repository خود بروید
   - روی تب `Settings` کلیک کنید

2. **اضافه کردن Secrets:**
   - از منوی سمت چپ `Secrets and variables` → `Actions` را انتخاب کنید
   - روی `New repository secret` کلیک کنید
   - دو secret زیر را اضافه کنید:

   **Secret اول:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://btvksaocmjufgfshyqfb.supabase.co
   ```

   **Secret دوم:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dmtzYW9jbWp1Zmdmc2h5cWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODczMDEsImV4cCI6MjA3NDY2MzMwMX0.YdY465d7i8HRn5JV9dc8vZ5CRDTs_Og3DfZwzuxRU1o
   ```

## 📄 مرحله ۲: فعال‌سازی GitHub Pages

1. **رفتن به تنظیمات Pages:**
   - همچنان در تب `Settings` باشید
   - از منوی سمت چپ `Pages` را انتخاب کنید

2. **تنظیم Source:**
   - در قسمت `Source` گزینه `GitHub Actions` را انتخاب کنید
   - (نه `Deploy from a branch`)

3. **ذخیره تنظیمات:**
   - تغییرات خودکار ذخیره می‌شود

## 🚀 مرحله ۳: Deploy کردن پروژه

### روش ۱: Push به Main Branch (توصیه شده)

```bash
# اضافه کردن تمام فایل‌ها
git add .

# commit کردن تغییرات
git commit -m "feat: add GitHub Pages deployment configuration"

# push به main branch
git push origin main
```

### روش ۲: اجرای دستی Action

1. به تب `Actions` در repository بروید
2. workflow "Deploy to GitHub Pages" را انتخاب کنید
3. روی `Run workflow` کلیک کنید
4. `Run workflow` را دوباره کلیک کنید

## 🔍 مرحله ۴: بررسی وضعیت Deploy

1. **مشاهده Progress:**
   - به تب `Actions` بروید
   - آخرین workflow run را انتخاب کنید
   - progress build و deploy را مشاهده کنید

2. **زمان تقریبی:**
   - Build: ۲-۳ دقیقه
   - Deploy: ۱-۲ دقیقه
   - کل: ۳-۵ دقیقه

3. **دریافت URL:**
   - پس از deploy موفق، در قسمت `Pages` تنظیمات، URL نمایش داده می‌شود
   - آدرس نهایی: `https://zarei176.github.io/school-management-system-elite-board/`

## ✅ مرحله ۵: تست عملکرد

 پس از deploy موفق، این موارد را تست کنید:

- [ ] صفحه اصلی (ثبت‌نام دانش‌آموز) باز می‌شود
- [ ] صفحه ورود مدیر (`/login`) کار می‌کند
- [ ] ورود با اطلاعات `admin` / `iran@1404` موفق است
- [ ] داشبورد مدیریت (`/dashboard`) نمایش داده می‌شود
- [ ] سیستم پیگیری (`/tracking`) قابل دسترسی است
- [ ] لوگو و تصاویر درست نمایش داده می‌شوند
- [ ] Routing بین صفحات درست کار می‌کند

## 🔧 عیب‌یابی مشکلات رایج

### ❌ خطای 404 هنگام refresh صفحه
**علت:** SPA routing تنظیم نشده
**راه‌حل:** فایل‌های `404.html` و تغییرات `index.html` موجود هستند

### ❌ خطای loading assets
**علت:** مسیر base اشتباه
**راه‌حل:** در `vite.config.ts` base path درست تنظیم شده: `/school-management-system-elite-board/`

### ❌ خطای اتصال به Supabase
**علت:** Environment variables تنظیم نشده
**راه‌حل:** GitHub Secrets را مجدداً بررسی کنید

### ❌ بیلد شکست خورده
**علت:** خطای TypeScript یا dependency
**راه‌حل:** 
```bash
# تست محلی
npm run build:gh-pages

# بررسی TypeScript
npx tsc --noEmit
```

## 🔄 به‌روزرسانی خودکار

پس از تنظیم اولیه، هر بار که تغییری در main branch اعمال کنید:

1. تغییرات خودکار تشخیص داده می‌شود
2. GitHub Action اجرا می‌شود
3. سایت به‌روزرسانی می‌شود
4. معمولاً ۳-۵ دقیقه طول می‌کشد

## 📞 پشتیبانی

در صورت بروز مشکل:
1. logs مربوط به GitHub Actions را بررسی کنید
2. مرحله‌های این راهنما را دوباره پیگیری کنید
3. در صورت لزوم، issue جدید در repository ایجاد کنید

---

**نکته مهم:** پس از هر تغییر در کد، حتماً تست محلی انجام دهید:

```bash
# تست build محلی
npm run build:gh-pages

# تست preview محلی
npm run preview:gh-pages
```

**موفق باشید! 🎉**