# Kawa Leaves Coffee

A modern cashierless cafe ordering system built with Next.js 15+, TypeScript, and Supabase. This application enables customers to order using QR codes and make cashless payments through Midtrans.

## Features

- 🔗 **QR Code Ordering**: Scan table QR codes to access digital menu
- 💳 **Cashless Payments**: Secure online payments via Midtrans (Snap)
- 👥 **Multi-Role Dashboard**: Admin, Owner, Super User, and Customer roles
- 🛒 **Smart Cart Management**: Real-time cart with customization options
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🔐 **Authentication**: Supabase Auth with role-based access control
- ⚡ **Real-time Updates**: Live order status tracking
- 🎨 **Modern UI**: Clean design with Lucide React icons

## Tech Stack

- **Frontend**: Next.js 15+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + clsx + class-variance-authority
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Payment**: Midtrans (Snap, sandbox)
- **QR Code**: qrcode, qrcode.react, react-qr-code
- **Form Validation**: React Hook Form + Zod
- **State Management**: Zustand
- **Data Fetching**: React Query (@tanstack/react-query)
- **Notifications**: react-hot-toast
- **Icons**: lucide-react
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm, yarn, pnpm, or bun
- Supabase account
- Midtrans account (for payments)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cafe_26
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

# App Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# QR Code Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   └── ui/             # Base UI components
├── lib/                # Utilities and configurations
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── store/              # Zustand state management
```

## User Roles

- **Customer (Guest/User)**: Browse menu, place orders, track status
- **Admin**: Manage products, orders, tables, and vouchers
- **Owner**: All admin features + sales statistics
- **Super User/Dev**: Full access including user management

## Key Features

### Product Customization
- **Beverages**: Hot/Ice temperature options
- **Sugar Levels**: Original, Less Sugar, No Sugar
- **Food**: Original or Spicy variations
- **Notes**: Custom requests

### Voucher System
- Role-based voucher access
- User-specific vouchers
- Discount limits and usage tracking

### Security
- Role-based route protection via middleware
- Midtrans signature validation
- Secure payment processing

## Development

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## Deployment

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@kawaleaves.com or join our Slack channel.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
