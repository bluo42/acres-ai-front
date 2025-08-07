#!/usr/bin/env python3
"""
Simple Python script to test Supabase connection and explore the database
"""

import os
from supabase import create_client, Client

# Your Supabase credentials
SUPABASE_URL = "https://pkjlsmdivverhbdxswen.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBramxzbWRpdnZlcmhiZHhzd2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5ODY5MzUsImV4cCI6MjAzODU2MjkzNX0.68H97Q9kNfMCJAg0q_gBbk"

def test_supabase_connection():
    """Test basic Supabase connection"""
    try:
        # Create Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client created successfully")
        
        # Test basic connection
        result = supabase.table("all_data_with_analysis").select("*").limit(1).execute()
        print("✅ Connection test successful")
        
        return supabase
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None

def explore_table_structure(supabase: Client):
    """Explore the structure of all_data_with_analysis table"""
    try:
        print("\n🔍 Exploring table structure...")
        
        # Get a sample row to see column structure
        result = supabase.table("all_data_with_analysis").select("*").limit(1).execute()
        
        if result.data and len(result.data) > 0:
            sample_row = result.data[0]
            print(f"📊 Found {len(sample_row)} columns:")
            
            for i, (column, value) in enumerate(sample_row.items(), 1):
                value_type = type(value).__name__
                value_preview = str(value)[:50] + "..." if len(str(value)) > 50 else str(value)
                print(f"  {i:2d}. {column:<25} = {value_preview} ({value_type})")
        else:
            print("❌ No data found in table")
            
    except Exception as e:
        print(f"❌ Error exploring table: {e}")

def get_table_stats(supabase: Client):
    """Get basic statistics about the table"""
    try:
        print("\n📈 Table Statistics:")
        
        # Count total rows
        result = supabase.table("all_data_with_analysis").select("*", count="exact").execute()
        total_rows = result.count
        print(f"  Total rows: {total_rows}")
        
        # Get a few sample rows
        result = supabase.table("all_data_with_analysis").select("*").limit(5).execute()
        print(f"  Sample data (first 5 rows):")
        
        for i, row in enumerate(result.data, 1):
            # Try to find key identifying fields
            identifier = (
                row.get('MLS_ID') or 
                row.get('id') or 
                row.get('address') or 
                row.get('property') or 
                f"Row {i}"
            )
            price = row.get('price') or row.get('Price') or 'N/A'
            print(f"    {i}. {identifier} - Price: {price}")
            
    except Exception as e:
        print(f"❌ Error getting table stats: {e}")

def test_specific_columns(supabase: Client):
    """Test for specific columns that the frontend expects"""
    print("\n🎯 Testing for expected columns...")
    
    expected_columns = [
        'MLS_ID', 'address', 'city', 'state', 'zip_code', 
        'price', 'beds', 'baths', 'lot_size', 'additional_units'
    ]
    
    try:
        # Try to select each column individually
        for column in expected_columns:
            try:
                result = supabase.table("all_data_with_analysis").select(column).limit(1).execute()
                if result.data:
                    sample_value = result.data[0].get(column)
                    print(f"  ✅ {column:<20} = {sample_value}")
                else:
                    print(f"  ❌ {column:<20} = No data")
            except Exception as e:
                print(f"  ❌ {column:<20} = Column not found or error: {e}")
                
    except Exception as e:
        print(f"❌ Error testing columns: {e}")

def main():
    """Main function to run all tests"""
    print("🚀 Starting Supabase Connection Test")
    print("=" * 50)
    
    # Test connection
    supabase = test_supabase_connection()
    if not supabase:
        return
    
    # Explore table
    explore_table_structure(supabase)
    
    # Get stats
    get_table_stats(supabase)
    
    # Test expected columns
    test_specific_columns(supabase)
    
    print("\n" + "=" * 50)
    print("🏁 Test completed!")

if __name__ == "__main__":
    main()