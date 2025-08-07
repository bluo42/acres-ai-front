# Property Analysis Backend

FastAPI backend for property underwriting analysis.

## Quick Start

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (copy from env_example.txt):
```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Run the server:
```bash
python main.py
```

API will be available at http://localhost:8000

## API Documentation

Visit http://localhost:8000/docs for interactive API documentation.

## Key Features

- Supabase integration for property data
- Advanced underwriting calculations
- 5-year cash flow projections
- Investment metrics (IRR, MOIC, Yield on Cost)
- Configurable parameters for different scenarios