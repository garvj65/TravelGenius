import cors from "cors";
import express, { json } from "express";
import { from } from "./config/supabase";

require('dotenv').config()

const app = express();

app.use(cors());
app.use(json());

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Travel Planner API' });
});

app.get('/test-supabase', async (req, res) => {
    try {
        // First, let's list all tables
        const { data: tables, error: tablesError } = await from('_tables')
            .select('*');
        
        console.log('Available tables:', tables);

        // Then try to query your users table
        const { data, error } = await from('users')  // Make sure this matches your table name exactly
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
