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

const sql = neon(process.env.VITE_DATABASE_URL);

async function testQuery(name, queryFn) {
    console.log(`\nTesting ${name}...`);
    const start = Date.now();
    try {
        const res = await queryFn();
        const duration = Date.now() - start;
        console.log(`✅ ${name}: Success in ${duration}ms. Rows: ${res.length}`);

        if (res.length > 0) {
            const sample = res[0];
            const size = JSON.stringify(sample).length;
            console.log(`   Approx size of 1 row: ${size} bytes`);

            // Calculate total size if it's blogs
            if (name.includes('Blogs')) {
                const totalSize = res.reduce((acc, row) => acc + JSON.stringify(row).length, 0);
                console.log(`   Total payload size: ${(totalSize / 1024).toFixed(2)} KB`);
            }

            // Check for large fields
            Object.keys(sample).forEach(key => {
                const val = sample[key];
                if (typeof val === 'string' && val.length > 1000) {
                    console.log(`   ⚠️ Large field '${key}': ${val.length} chars`);
                }
            });
        }
    } catch (e) {
        console.log(`❌ ${name}: Failed in ${Date.now() - start}ms. Error: ${e.message}`);
    }
}

async function run() {
    console.log('--- STARTING DB DIAGNOSTICS ---');

    // Test 1: Simple connection check
    await testQuery('Connection Check', () => sql`SELECT 1`);

    // Test 2: Properties
    await testQuery('Get Properties', () => sql`SELECT * FROM properties`);

    // Test 3: Hero Slides
    await testQuery('Get Hero Slides', () => sql`SELECT * FROM hero_slides`);

    // Test 4: Blogs Full
    await testQuery('Get Blogs (Full Content)', () => sql`SELECT * FROM blogs LIMIT 10`);

    // Test 5: Blogs Optimized
    await testQuery('Get Blogs (Optimized)', () => sql`SELECT id, title, slug, category, featured_image, excerpt, published_at FROM blogs LIMIT 10`);

    console.log('\n--- DIAGNOSTICS COMPLETE ---');
}

run();
