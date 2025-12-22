
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env');

console.log('Reading .env from:', envPath);
const envContent = fs.readFileSync(envPath, 'utf-8');
const dbUrlMatch = envContent.match(/VITE_DATABASE_URL=(.*)/);

if (!dbUrlMatch) {
    console.error('Could not find VITE_DATABASE_URL in .env');
    process.exit(1);
}

const databaseUrl = dbUrlMatch[1].trim();
console.log('Database URL found (masked):', databaseUrl.replace(/:[^:@]*@/, ':****@'));

const sql = neon(databaseUrl);

async function diagnose() {
    try {
        console.log('\n--- Checking Tables ---');
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `;
        console.log('Tables found:', tables.map(t => t.table_name));

        if (tables.length === 0) {
            console.error('No tables found in public schema!');
            return;
        }

        const hasProperties = tables.some(t => t.table_name === 'properties');
        if (hasProperties) {
            console.log('\n--- Checking Properties Table ---');
            const count = await sql`SELECT COUNT(*) FROM properties`;
            console.log('Total properties:', count[0].count);

            const sample = await sql`SELECT * FROM properties LIMIT 1`;
            if (sample.length > 0) {
                console.log('Sample property (ID):', sample[0].id);
                console.log('Sample property (Title):', sample[0].title);
                console.log('Sample property (Images type):', typeof sample[0].images);
                console.log('Sample property (Images value):', JSON.stringify(sample[0].images));
            } else {
                console.log('Properties table is empty.');
            }
        } else {
            console.error('properties table missing!');
        }

    } catch (err) {
        console.error('Diagnostic failed:', err);
    }
}

diagnose();
