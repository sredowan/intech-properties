import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

// Load .env manually
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const parts = line.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join('=').trim();
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.error('Error reading .env', e);
    }
};

loadEnv();

if (!process.env.VITE_DATABASE_URL) {
    console.error('VITE_DATABASE_URL not found in .env');
    process.exit(1);
}

const baseSql = neon(process.env.VITE_DATABASE_URL);
const sql = async (strings, ...values) => {
    return baseSql(strings, ...values);
};

function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

async function fixSlugs() {
    console.log('--- FIXING PROPERTY SLUGS ---');
    try {
        const properties = await sql`SELECT id, title, slug FROM properties`;

        for (const p of properties) {
            if (!p.slug) {
                const newSlug = createSlug(p.title);
                console.log(`Fixing slug for "${p.title}" -> "${newSlug}"`);
                await sql`UPDATE properties SET slug = ${newSlug} WHERE id = ${p.id}`;
            } else {
                console.log(`Slug exists for "${p.title}": ${p.slug}`);
            }
        }
        console.log('Done.');

    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

fixSlugs();
