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

// Create SQL function manually for this script
// Using wrapper to simulate the app's behavior if needed, but simple neon is fine for check
const baseSql = neon(process.env.VITE_DATABASE_URL);
const sql = async (strings, ...values) => {
    return baseSql(strings, ...values);
};

async function checkPropertyData() {
    console.log('--- CHECKING PROPERTY DATA ---');
    try {
        const properties = await sql`SELECT id, title, images, floor_plans FROM properties`;

        console.log(`Found ${properties.length} properties.`);

        properties.forEach(p => {
            console.log(`\nProperty: ${p.title} (Slug: ${p.slug || 'N/A'})`);

            // Check Images
            const images = p.images || [];
            console.log(`  - Images Count: ${images.length}`);
            if (images.length > 0) {
                console.log(`  - First Image: ${images[0]}`);
            } else {
                console.log(`  - ⚠️ NO IMAGES`);
            }

            // Check Floor Plans
            const floorPlans = p.floor_plans || [];
            console.log(`  - Floor Plans Count: ${floorPlans.length}`);
            if (floorPlans.length > 0) {
                console.log(`  - First Plan: ${floorPlans[0].name || floorPlans[0].fave_plan_title || 'Untitled'}`);
            } else {
                console.log(`  - ⚠️ NO FLOOR PLANS`);
            }
        });

    } catch (e) {
        console.error('Error:', e);
    }
    process.exit(0);
}

checkPropertyData();
