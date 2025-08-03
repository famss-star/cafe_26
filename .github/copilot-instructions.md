# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Proyek ini adalah aplikasi web cafe modern bernama **Kawa Leaves Coffee** yang memungkinkan pelanggan melakukan pemesanan menggunakan **QR Code** dan melakukan pembayaran **cashless**. Sistem dirancang agar **cashierless**, efisien, dan memiliki dashboard multi-role untuk pengelolaan produk, transaksi, dan laporan.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + clsx + class-variance-authority
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Payment**: Midtrans (Snap, sandbox)
- **QR Code**: qrcode, qrcode.react, react-qr-code
- **Form Validation**: React Hook Form + Zod
- **State Management**: Zustand
- **Data Fetching & Caching**: React Query (@tanstack/react-query)
- **Notification**: react-hot-toast
- **Icons**: lucide-react
- **Deployment**: Vercel

## Folder Structure
- `/src/app`: Next.js App Router pages/layouts
- `/src/components`: Reusable UI components
- `/src/lib`: Konfigurasi Supabase, Midtrans, dan utilitas lainnya
- `/src/types`: TypeScript type definitions
- `/src/hooks`: Custom React hooks
- `/src/store`: Zustand state management (e.g., cart)

## Fitur Utama
- Scan QR Code meja untuk memesan
- Guest & Logged-in Customer (tanpa atau dengan akun)
- Menu produk dengan detail dan opsi kustomisasi
- Manajemen keranjang belanja (cart)
- Pembayaran online via Midtrans Snap
- Tracking status order secara real-time
- Notifikasi sukses/gagal
- Dashboard untuk:
  - Admin (kelola pesanan & produk)
  - Owner (lihat statistik penjualan & total user)
  - Super User/Dev (akses penuh + log Supabase, Vercel, dan CRUD user)
- Proteksi role dan rute dengan middleware

## Fitur Khusus
1. **Produk Kustom**
   - Minuman: Hot / Ice
   - Gula: Original / Less Sugar / No Sugar
   - Makanan: Original / Pedas
   - Catatan: teks opsional untuk request tambahan

2. **Voucher**
   - Hanya customer tertentu yang bisa menggunakan
   - Bisa berdasarkan role/user ID/email

3. **Produk Serupa**
   - Produk dengan variasi atau kemiripan ditampilkan sebagai saran

4. **Roles dan Akses**
   - Customer (Guest/User)
     - Browse menu, pesan, bayar
     - Lihat status order
     - Dashboard akun, riwayat pembelian, ubah data diri, kategori favorit (berdasarkan produk yang sering dipesan)
   - Admin
     - Kelola menu, crud menu
     - Lihat order yang sedang berlangsung
     - Kelola qr meja, crud qr meja
     - Kelola voucher, crud voucher
   - Owner
     - Lihat semua fitur admin
     - Tambahan: statistik penjualan, jumlah total user
   - Super User / Dev
     - Akses penuh (log Supabase, Vercel, dan CRUD user)
     - Satu-satunya yang boleh mengubah role pengguna lain

5. **Keamanan**
   - Semua rute dilindungi dengan middleware role-based
   - Validasi transaksi dari Midtrans dengan signature key
   - Middleware untuk memisahkan akses Guest dan User login

## Standar Kode
- Gunakan TypeScript penuh
- Gunakan Server Component jika cocok untuk performa
- Error handling lengkap (try/catch + fallback UI)
- Loading states untuk semua data async
- Desain responsif, mobile-first
- Ikuti praktik terbaik aksesibilitas (a11y)

## Coding Guidelines
- Always use TypeScript with strict type checking
- Prefer Server Components for better performance when possible
- Use proper error boundaries and error handling
- Implement loading states for all async operations
- Follow mobile-first responsive design principles
- Ensure accessibility (a11y) best practices
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Implement proper authentication and authorization checks
- Use environment variables for sensitive configuration
- Follow Next.js 15 App Router best practices
