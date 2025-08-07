# Property Analysis App - Next.js Frontend

A modern Next.js application for real estate investment analysis and underwriting with direct Supabase integration.

## 🚀 Features

- **Modern Next.js 14** with App Router
- **Direct Supabase Integration** - No backend required
- **Real-time Property Analysis** - Interactive underwriting calculations
- **Responsive Design** - TailwindCSS with modern UI
- **TypeScript** - Full type safety
- **Client-side Calculations** - Fast, responsive analysis

## 📋 Prerequisites

- Node.js 18+
- Supabase account and database
- Your Supabase database should have the `all_data_with_analysis` table

## 🛠️ Installation

1. **Navigate to the project:**
```bash
cd frontendonly
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. **Get your Supabase credentials:**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Go to **Settings** → **API**
   - Copy the **Project URL** and **anon/public key**

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Visit `http://localhost:3000`

## 📊 Database Schema

Your Supabase `all_data_with_analysis` table should include:

```sql
CREATE TABLE all_data_with_analysis (
  MLS_ID INTEGER PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  price NUMERIC NOT NULL,
  beds INTEGER NOT NULL,
  baths INTEGER NOT NULL,
  square_feet NUMERIC,
  days_on_market INTEGER,
  lot_size NUMERIC NOT NULL,
  additional_units NUMERIC,
  base_rent NUMERIC DEFAULT 6710,
  unit_type_1_num_units NUMERIC,
  unit_type_2_num_units NUMERIC,
  -- ... up to unit_type_10_num_units
  unit_type_10_num_units NUMERIC
);
```

## 🏗️ Project Structure

```
frontendonly/
├── app/
│   ├── page.tsx                 # Home page (property list)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── providers/
│   │   └── query-provider.tsx   # React Query provider
│   └── underwriting/
│       └── [id]/
│           └── page.tsx         # Underwriting analysis page
├── components/
│   └── navbar.tsx               # Navigation component
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript types
│   ├── property-service.ts     # Property data service
│   └── underwriting-calculations.ts # Business logic
└── ...config files
```

## 💡 Key Features

### 🏠 Property Dashboard
- View all properties from your Supabase database
- Display key metrics: price, beds, baths, lot size
- Show additional units and total planned units
- Direct links to underwriting analysis

### 📈 Underwriting Analysis
- Configure additional dwelling units (ADUs)
- Set construction costs and rental income
- Adjust advanced parameters (cap rates, expenses, etc.)
- Real-time 5-year cash flow projections
- Investment metrics: IRR, MOIC, Yield on Cost

### 🎨 Modern UI
- Clean, professional design
- Responsive layout for all devices
- Loading states and error handling
- Interactive forms with real-time updates

## 🔧 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔐 Environment Variables

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 Usage

1. **Home Page**: Browse your property portfolio
2. **Property Analysis**: Click "Analyze Property" to start underwriting
3. **Configure Units**: Add/remove ADU units with specifications
4. **Advanced Settings**: Adjust cap rates, expenses, and other parameters
5. **View Results**: Get comprehensive investment analysis and projections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational and professional use in real estate analysis.

---

## Why No Backend?

This frontend-only approach provides several advantages:

✅ **Simpler Architecture** - Single codebase to maintain  
✅ **Better Performance** - Direct database queries, no API overhead  
✅ **Easier Deployment** - Static site deployment options  
✅ **Cost Effective** - No server costs, only database and hosting  
✅ **Supabase Security** - Built-in authentication and row-level security  
✅ **Real-time Features** - Supabase real-time subscriptions available  

The calculations run entirely in the browser, providing instant results while Supabase handles data persistence and security.

## 🚀 Quick Start Commands

```bash
# Navigate to the project
cd frontendonly

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_SUPABASE_URL=your_url_here" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here" >> .env.local

# Start development
npm run dev
```

Visit `http://localhost:3000` to see your property analysis app!