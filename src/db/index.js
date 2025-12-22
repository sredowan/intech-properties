import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables
const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
    console.error('VITE_DATABASE_URL is not set in environment variables');
}

// Create the base SQL function
const baseSql = neon(databaseUrl);

// Timeout wrapper function to prevent infinite hangs
const withTimeout = (promise, ms = 10000) => {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database query timeout')), ms)
    );
    return Promise.race([promise, timeout]);
};

// Wrapped SQL function with timeout - uses tagged template literals
export const sql = async (strings, ...values) => {
    try {
        // Create the query from tagged template
        const result = await withTimeout(baseSql(strings, ...values), 10000);
        return result;
    } catch (error) {
        console.error('SQL query error or timeout:', error.message);
        throw error;
    }
};

// Helper function to run queries
export async function query(queryString, params = []) {
    try {
        const result = await withTimeout(baseSql(queryString, params), 10000);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

export default sql;
