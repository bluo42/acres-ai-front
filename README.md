# Property Analysis App

A full-stack property analysis application for real estate underwriting with FastAPI backend and React frontend.

## Features

- **Property Portfolio Dashboard**: View all properties with key metrics
- **Advanced Underwriting Analysis**: Calculate 5-year cash flow projections
- **Investment Metrics**: IRR, MOIC, Yield on Cost calculations
- **Unit Configuration**: Customize ADU specifications and construction costs
- **Real-time Calculations**: Based on proven underwriting formulas

## Tech Stack

**Backend:**
- FastAPI (Python)
- Supabase integration
- Pydantic models
- Pandas for calculations

**Frontend:**
- React 18 with TypeScript
- TailwindCSS for styling
- React Query for data fetching
- React Router for navigation
- Lucide React for icons

## Prerequisites

- Python 3.8+
- Node.js 16+
- Supabase account and database

## Database Setup

Your Supabase database should have a table called `all_data_with_analysis` with the following columns:

```sql
CREATE TABLE all_data_with_analysis (
  id SERIAL PRIMARY KEY,
  property TEXT NOT NULL,
  price NUMERIC NOT NULL,
  current_units INTEGER NOT NULL,
  current_beds INTEGER NOT NULL,
  current_baths INTEGER NOT NULL,
  lot_size NUMERIC NOT NULL,
  detailed_analysis JSONB,
  base_rent NUMERIC DEFAULT 6710
);
```

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `env_example.txt`:
```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Start the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Home Page**: View all properties in your portfolio with key details
2. **Analyze Property**: Click "Analyze Property" to access the underwriting page
3. **Configure Units**: Add/remove ADU units and specify their details
4. **Adjust Settings**: Modify advanced parameters like cap rates, expenses, etc.
5. **View Results**: Get comprehensive 5-year projections and investment metrics

## API Endpoints

- `GET /properties` - Fetch all properties
- `POST /underwriting` - Calculate underwriting analysis

## Key Calculations

The app implements the underwriting model from the provided Jupyter notebook:

- **Construction Costs**: Based on unit specifications
- **NOI Projections**: Accounting for vacancy, expenses, and rent growth
- **Property Valuation**: Using cap rate methodology
- **Cash Flow Analysis**: 5-year projections with sale proceeds
- **Investment Metrics**: IRR, MOIC, and Yield on Cost

## Development

- Backend API docs available at `http://localhost:8000/docs`
- Frontend uses modern React patterns with TypeScript
- TailwindCSS for responsive, modern UI design
- React Query for efficient data fetching and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and professional use in real estate analysis.