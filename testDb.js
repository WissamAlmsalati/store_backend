import poolPromise from './src/config/db.js'; // Adjust this path if necessary

async function testDatabaseConnection() {
    try {
        const pool = await poolPromise;
        console.log("✅ Database connection successful!");

        const [products] = await pool.query('SELECT id, name, price, stock FROM products');
        console.log("📌 Query Result:", products);

        if (!products || products.length === 0) {
            console.warn("⚠️ No products found in the database.");
        } else {
            console.log("✅ Products fetched successfully:", products);
        }
    } catch (error) {
        console.error("❌ Database connection failed!", error);
    }
}

testDatabaseConnection();
