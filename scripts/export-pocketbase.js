const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'pocketbase', 'pb_data', 'data.db');
if (!fs.existsSync(dbPath)) {
  console.error('Pocketbase db not found at', dbPath);
  process.exit(1);
}

const db = new DatabaseSync(dbPath, { readOnly: true });
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables found:', tables.map(t => t.name));

const products = db.prepare("SELECT * FROM products").all();
console.log('Total products count:', products.length);

const exportPath = path.join(__dirname, 'exported_products.json');
fs.writeFileSync(exportPath, JSON.stringify(products, null, 2));
console.log('Successfully saved to', exportPath);
