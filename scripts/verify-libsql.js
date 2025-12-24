const { createClient } = await import("@libsql/client");
const db = createClient({ url: "file:fieldnotes.db" });

// 1. Show all tables
const tables = await db.execute(
  "SELECT name FROM sqlite_master WHERE type='table'"
);
console.log("Tables:");
console.table(tables.rows);

// 2. Show first 5 users
const users = await db.execute("SELECT * FROM users LIMIT 5");
console.log("Users Data:");
console.table(users.rows);
