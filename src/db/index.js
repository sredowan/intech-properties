import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
    console.error('VITE_DATABASE_URL is not set in environment variables');
}

// Create a SQL function for querying
export const sql = neon(databaseUrl);

// Helper function to run queries
export async function query(queryString, params = []) {
    try {
        const result = await sql(queryString, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export default sql;
