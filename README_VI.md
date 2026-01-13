# 🧶 Nekozanedex Frontend - Nền tảng Đọc Truyện Chữ Hiện Đại

[English version](./README.md) | **Tiếng Việt**

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

Nekozanedex là một nền tảng đọc truyện web novel hiệu suất cao, hiện đại được xây dựng bằng **Next.js 15+**. Dự án tập trung vào trải nghiệm người dùng mượt mà, áp dụng Server-Side Rendering (SSR), hệ thống xác thực bảo mật và quản lý nội dung chuyên nghiệp.

---

## ✨ Tính năng Nổi bật

### 📖 Trải nghiệm Đọc truyện

- **Chế độ đọc tối ưu**: Giao diện sạch sẽ với các tùy chỉnh linh hoạt (font chữ, kích thước văn bản, giao diện theme).
- **Khám phá không giới hạn**: Tìm kiếm và lọc truyện qua Trang chủ, Bảng xếp hạng, Thể loại và Tìm kiếm nâng cao.
- **Dấu trang & Lịch sử**: Lưu tiến trình đọc và theo dõi lịch sử các chương đã đọc.

### 🔐 Hệ thống Xác thực Nâng cao

- **SSR-First Auth**: Quản lý phiên đăng nhập an toàn sử dụng Server Components và Server Actions.
- **Utility Xác thực Tập trung**: `src/shared/lib/server-auth.ts` cung cấp giao diện thống nhất để quản lý token và gọi API xác thực (`authFetch`).
- **Proxy Thích ứng**: Middleware thông minh tự động làm mới token cho cả route bảo mật và công khai (public), đảm bảo trạng thái UI luôn chính xác.
- **Phát hiện tái sử dụng JWT**: Bảo mật cấp độ doanh nghiệp chống đánh cắp token và truy cập trái phép.

### 🛠️ Quản trị (Admin Dashboard)

- **Modular Admin API**: Logic server được tách thành các module chuyên biệt (`stories.ts`, `chapters.ts`,...) giúp dễ bảo trì và mở rộng.
- **Quản lý Truyện toàn diện**: CRUD cho truyện, thể loại và chương truyện.
- **Import hàng loạt**: Hỗ trợ đăng nhiều chương cùng lúc một cách nhanh chóng.
- **Quản lý Hình ảnh**: Tích hợp Cloudinary để quản lý ảnh bìa truyện.
- **Thống kê Thời gian thực**: Theo dõi hiệu suất và lưu lượng truy cập nền tảng.

### 🎨 Thiết kế & UX

- **Theme System**: Chuyển đổi Dark/Light mode mượt mà, tối ưu hóa Hydration (không bị giật lag giao diện - layout shift).
- **Thiết kế Đáp ứng (Responsive)**: Ưu tiên di động, mang lại trải nghiệm tốt nhất trên mọi kích cỡ màn hình.
- **Skeleton Loaders**: Trạng thái tải nội dung chuyên nghiệp theo phong cách Modern UI.

---

## 🚀 Công nghệ Sử dụng

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Quản lý Trạng thái**: React Server Actions & Hooks
- **Thông báo**: [Sonner](https://sonner.emilkowal.ski/) (Toasts)

---

## 🛠️ Bắt đầu (Cài đặt)

### Yêu cầu hệ thống

- Node.js 18+
- npm / yarn / pnpm

### Cài đặt các bước

1. Clone repository:

   ```bash
   git clone https://github.com/yourusername/nekozanedex-frontend.git
   cd nekozanedex-frontend
   ```

2. Cài đặt các thư viện:

   ```bash
   npm install
   ```

3. Cấu hình biến môi trường:
   Tạo file `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:9091/api
   NEXT_PUBLIC_COOKIE_DOMAIN=localhost
   ```

4. Chạy dự án:
   ```bash
   npm run dev
   ```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

---

## 📁 Cấu trúc Thư mục

```plaintext
src/
├── app/                  # App Router: Trang và API Routes
├── features/             # Các module tính năng (Admin, Auth, Story,...)
│   ├── [feature]/
│   │   ├── actions/      # Server Actions
│   │   ├── components/   # UI Components
│   │   ├── server/       # Modularized API logic
│   │   └── types/        # TypeScript Definitions
├── shared/               # Components, hooks và libs dùng chung
│   ├── lib/
│   │   └── server-auth.ts # Logic Xác thực Server-Side cốt lõi
├── response/             # Xử lý theo Result Pattern
└── proxy.ts              # Proxy thông minh cho Auth & Routing
```

---

## 🛡️ Kiến trúc & Quy chuẩn

- **Result Pattern**: Xử lý lỗi nhất quán giúp luồng dữ liệu dễ dự đoán.
- **Feature-Based Module System**: Cấu trúc thư mục dễ mở rộng.
- **Server/Client Separation**: Phân tách rõ ràng giữa Logic Server và Client để tối ưu hiệu suất và bảo mật.
- **Clean Code**: Tuân thủ các tiêu chuẩn ngành để dễ bảo trì.

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo Pull Request nếu bạn có cải tiến mới.

## 📄 Bản quyền

Dự án được phát hành theo Giấy phép MIT.
