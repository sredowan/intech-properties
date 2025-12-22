import { sql } from './index.js';

// ============================================
// INITIALIZE DATABASE TABLES
// ============================================

export async function initializeDatabase() {
    try {
        // Create properties table
        await sql`
            CREATE TABLE IF NOT EXISTS properties (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                location TEXT,
                area TEXT,
                area_unit TEXT DEFAULT 'sft',
                price TEXT,
                price_label TEXT,
                bedrooms INTEGER,
                bathrooms INTEGER,
                status TEXT DEFAULT 'Ongoing',
                features JSONB DEFAULT '[]',
                images JSONB DEFAULT '[]',
                floor_plans JSONB DEFAULT '[]',
                description TEXT,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create blogs table
        await sql`
            CREATE TABLE IF NOT EXISTS blogs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                slug TEXT UNIQUE NOT NULL,
                category TEXT,
                featured_image TEXT,
                excerpt TEXT,
                content TEXT,
                published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create blog_categories table
        await sql`
            CREATE TABLE IF NOT EXISTS blog_categories (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE NOT NULL
            )
        `;

        // Create gallery table
        await sql`
            CREATE TABLE IF NOT EXISTS gallery (
                id TEXT PRIMARY KEY,
                category TEXT,
                image_url TEXT NOT NULL,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create testimonials table
        await sql`
            CREATE TABLE IF NOT EXISTS testimonials (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create hero_slides table
        await sql`
            CREATE TABLE IF NOT EXISTS hero_slides (
                id TEXT PRIMARY KEY,
                image TEXT NOT NULL,
                title TEXT,
                subtitle TEXT,
                button_text TEXT,
                button_link TEXT,
                is_active BOOLEAN DEFAULT true,
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Create settings table (key-value store)
        await sql`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value JSONB
            )
        `;

        // Create enquiries table
        await sql`
            CREATE TABLE IF NOT EXISTS enquiries (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                message TEXT,
                property_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log('Database tables initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// ============================================
// PROPERTIES
// ============================================

export async function getProperties() {
    const result = await sql`
        SELECT * FROM properties ORDER BY sort_order ASC, created_at DESC
    `;
    return result.map(row => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        location: row.location,
        area: row.area,
        areaUnit: row.area_unit,
        price: row.price,
        priceLabel: row.price_label,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        status: row.status,
        features: row.features || [],
        images: row.images || [],
        floorPlans: row.floor_plans || [],
        description: row.description,
        order: row.sort_order
    }));
}

export async function getPropertyBySlug(slug) {
    const result = await sql`
        SELECT * FROM properties WHERE slug = ${slug} LIMIT 1
    `;
    if (result.length === 0) return null;
    const row = result[0];
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        location: row.location,
        area: row.area,
        areaUnit: row.area_unit,
        price: row.price,
        priceLabel: row.price_label,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        status: row.status,
        features: row.features || [],
        images: row.images || [],
        floorPlans: row.floor_plans || [],
        description: row.description,
        order: row.sort_order
    };
}

export async function saveProperty(property) {
    const id = property.id || Date.now().toString();
    await sql`
        INSERT INTO properties (id, title, slug, location, area, area_unit, price, price_label, bedrooms, bathrooms, status, features, images, floor_plans, description, sort_order)
        VALUES (
            ${id},
            ${property.title},
            ${property.slug},
            ${property.location},
            ${property.area},
            ${property.areaUnit || 'sft'},
            ${property.price},
            ${property.priceLabel},
            ${property.bedrooms},
            ${property.bathrooms},
            ${property.status || 'Ongoing'},
            ${JSON.stringify(property.features || [])},
            ${JSON.stringify(property.images || [])},
            ${JSON.stringify(property.floorPlans || [])},
            ${property.description},
            ${property.order || 0}
        )
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            slug = EXCLUDED.slug,
            location = EXCLUDED.location,
            area = EXCLUDED.area,
            area_unit = EXCLUDED.area_unit,
            price = EXCLUDED.price,
            price_label = EXCLUDED.price_label,
            bedrooms = EXCLUDED.bedrooms,
            bathrooms = EXCLUDED.bathrooms,
            status = EXCLUDED.status,
            features = EXCLUDED.features,
            images = EXCLUDED.images,
            floor_plans = EXCLUDED.floor_plans,
            description = EXCLUDED.description,
            sort_order = EXCLUDED.sort_order,
            updated_at = CURRENT_TIMESTAMP
    `;
    return id;
}

export async function deleteProperty(id) {
    await sql`DELETE FROM properties WHERE id = ${id}`;
}

// ============================================
// BLOGS
// ============================================

export async function getBlogs() {
    const result = await sql`
        SELECT * FROM blogs ORDER BY published_at DESC
    `;
    return result.map(row => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        featuredImage: row.featured_image,
        excerpt: row.excerpt,
        content: row.content,
        publishedAt: row.published_at
    }));
}

export async function getBlogBySlug(slug) {
    const result = await sql`
        SELECT * FROM blogs WHERE slug = ${slug} LIMIT 1
    `;
    if (result.length === 0) return null;
    const row = result[0];
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        category: row.category,
        featuredImage: row.featured_image,
        excerpt: row.excerpt,
        content: row.content,
        publishedAt: row.published_at
    };
}

export async function saveBlog(blog) {
    const id = blog.id || Date.now().toString();
    await sql`
        INSERT INTO blogs (id, title, slug, category, featured_image, excerpt, content, published_at)
        VALUES (
            ${id},
            ${blog.title},
            ${blog.slug},
            ${blog.category},
            ${blog.featuredImage},
            ${blog.excerpt},
            ${blog.content},
            ${blog.publishedAt || new Date().toISOString()}
        )
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            slug = EXCLUDED.slug,
            category = EXCLUDED.category,
            featured_image = EXCLUDED.featured_image,
            excerpt = EXCLUDED.excerpt,
            content = EXCLUDED.content,
            published_at = EXCLUDED.published_at
    `;
    return id;
}

export async function deleteBlog(id) {
    await sql`DELETE FROM blogs WHERE id = ${id}`;
}

// ============================================
// BLOG CATEGORIES
// ============================================

export async function getBlogCategories() {
    const result = await sql`SELECT * FROM blog_categories ORDER BY name`;
    return result.map(row => row.name);
}

export async function addBlogCategory(name) {
    const id = Date.now().toString();
    await sql`
        INSERT INTO blog_categories (id, name) VALUES (${id}, ${name})
        ON CONFLICT (name) DO NOTHING
    `;
}

export async function deleteBlogCategory(name) {
    await sql`DELETE FROM blog_categories WHERE name = ${name}`;
}

// ============================================
// GALLERY
// ============================================

export async function getGallery() {
    const result = await sql`
        SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC
    `;
    return result.map(row => ({
        id: row.id,
        category: row.category,
        imageUrl: row.image_url,
        order: row.sort_order
    }));
}

export async function addGalleryItem(item) {
    const id = item.id || Date.now().toString();
    await sql`
        INSERT INTO gallery (id, category, image_url, sort_order)
        VALUES (${id}, ${item.category}, ${item.imageUrl}, ${item.order || 0})
    `;
    return id;
}

export async function deleteGalleryItem(id) {
    await sql`DELETE FROM gallery WHERE id = ${id}`;
}

// ============================================
// TESTIMONIALS
// ============================================

export async function getTestimonials() {
    const result = await sql`
        SELECT * FROM testimonials ORDER BY created_at DESC
    `;
    return result.map(row => ({
        id: row.id,
        name: row.name,
        text: row.text,
        createdAt: row.created_at
    }));
}

export async function addTestimonial(testimonial) {
    const id = testimonial.id || Date.now().toString();
    await sql`
        INSERT INTO testimonials (id, name, text)
        VALUES (${id}, ${testimonial.name}, ${testimonial.text})
    `;
    return id;
}

export async function deleteTestimonial(id) {
    await sql`DELETE FROM testimonials WHERE id = ${id}`;
}

// ============================================
// HERO SLIDES
// ============================================

export async function getHeroSlides() {
    const result = await sql`
        SELECT * FROM hero_slides ORDER BY sort_order ASC
    `;
    return result.map(row => ({
        id: row.id,
        image: row.image,
        title: row.title,
        subtitle: row.subtitle,
        buttonText: row.button_text,
        buttonLink: row.button_link,
        isActive: row.is_active,
        order: row.sort_order
    }));
}

export async function saveHeroSlide(slide) {
    const id = slide.id || Date.now().toString();
    await sql`
        INSERT INTO hero_slides (id, image, title, subtitle, button_text, button_link, is_active, sort_order)
        VALUES (
            ${id},
            ${slide.image},
            ${slide.title},
            ${slide.subtitle},
            ${slide.buttonText},
            ${slide.buttonLink},
            ${slide.isActive !== false},
            ${slide.order || 0}
        )
        ON CONFLICT (id) DO UPDATE SET
            image = EXCLUDED.image,
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            button_text = EXCLUDED.button_text,
            button_link = EXCLUDED.button_link,
            is_active = EXCLUDED.is_active,
            sort_order = EXCLUDED.sort_order
    `;
    return id;
}

export async function deleteHeroSlide(id) {
    await sql`DELETE FROM hero_slides WHERE id = ${id}`;
}

// ============================================
// SETTINGS
// ============================================

export async function getSettings(key) {
    const result = await sql`
        SELECT value FROM settings WHERE key = ${key} LIMIT 1
    `;
    if (result.length === 0) return null;
    return result[0].value;
}

export async function saveSettings(key, value) {
    await sql`
        INSERT INTO settings (key, value) VALUES (${key}, ${JSON.stringify(value)})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
}

// ============================================
// ENQUIRIES
// ============================================

export async function getEnquiries() {
    const result = await sql`
        SELECT * FROM enquiries ORDER BY created_at DESC
    `;
    return result.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        message: row.message,
        propertyId: row.property_id,
        createdAt: row.created_at
    }));
}

export async function addEnquiry(enquiry) {
    const id = enquiry.id || Date.now().toString();
    await sql`
        INSERT INTO enquiries (id, name, email, phone, message, property_id)
        VALUES (${id}, ${enquiry.name}, ${enquiry.email}, ${enquiry.phone}, ${enquiry.message}, ${enquiry.propertyId})
    `;
    return id;
}

export async function deleteEnquiry(id) {
    await sql`DELETE FROM enquiries WHERE id = ${id}`;
}

// ============================================
// COUNTS (for Dashboard)
// ============================================

export async function getCounts() {
    const [properties, blogs, enquiries, gallery, testimonials] = await Promise.all([
        sql`SELECT COUNT(*) as count FROM properties`,
        sql`SELECT COUNT(*) as count FROM blogs`,
        sql`SELECT COUNT(*) as count FROM enquiries`,
        sql`SELECT COUNT(*) as count FROM gallery`,
        sql`SELECT COUNT(*) as count FROM testimonials`
    ]);

    return {
        properties: parseInt(properties[0]?.count || 0),
        blogs: parseInt(blogs[0]?.count || 0),
        enquiries: parseInt(enquiries[0]?.count || 0),
        gallery: parseInt(gallery[0]?.count || 0),
        testimonials: parseInt(testimonials[0]?.count || 0)
    };
}
