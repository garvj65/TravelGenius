require('dotenv').config()
const express = require('express');
const cors = require('cors');
const supabase = require('./config/supabase');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Travel Planner API' });
});

app.get('/test-supabase', async (req, res) => {
    try {
        // First, let's list all tables
        const { data: tables, error: tablesError } = await supabase
            .from('_tables')
            .select('*');
        
        console.log('Available tables:', tables);

        // Then try to query your users table
        const { data, error } = await supabase
            .from('users')  // Make sure this matches your table name exactly
            .select('*');
        
        console.log('Query response:', { data, error });

        if (error) throw error;
        
        res.json({
            message: 'Query successful',
            tables: tables, // This will show available tables
            rowCount: data ? data.length : 0,
            data: data
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
