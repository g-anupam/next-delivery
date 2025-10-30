import { connectToDatabase } from './src/lib/db';

async function testDB() {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('✅ MySQL Connected! Test result:', (rows as any)[0].result);
  } catch (err) {
    console.error('❌ DB Connection Error:', err);
  }
}

testDB();
