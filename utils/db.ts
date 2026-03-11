import { sql } from '@vercel/postgres';

export async function initializeDb() {
  // Create tables if they don't exist
  await sql`
    CREATE TABLE IF NOT EXISTS wishes (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rsvp (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      guests INTEGER NOT NULL DEFAULT 1,
      attendance VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// For wishes queries
export async function getWishes() {
  const { rows } = await sql`SELECT * FROM wishes ORDER BY created_at DESC`;
  return rows;
}

export async function addWish(name: string, message: string) {
  await sql`INSERT INTO wishes (name, message) VALUES (${name}, ${message})`;
}

// For RSVP queries
export async function getRsvps() {
  const { rows } = await sql`SELECT * FROM rsvp ORDER BY created_at DESC`;
  return rows;
}

export async function addRsvp(name: string, guests: number, attendance: string) {
  await sql`INSERT INTO rsvp (name, guests, attendance) VALUES (${name}, ${guests}, ${attendance})`;
}

export async function deleteWish(id: number) {
  await sql`DELETE FROM wishes WHERE id = ${id}`;
}
