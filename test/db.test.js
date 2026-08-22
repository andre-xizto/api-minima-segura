import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import db from '../src/db.js';

beforeAll(() => {
  db.prepare('DELETE FROM items').run();
});

afterAll(() => {
  db.close();
});

describe('banco de dados', () => {
  it('insere e lê um item', () => {
    const info = db.prepare('INSERT INTO items (name) VALUES (?)').run('db-item');
    const item = db.prepare('SELECT * FROM items WHERE id = ?').get(info.lastInsertRowid);
    expect(item.name).toBe('db-item');
  });

  it('lista itens em ordem decrescente', () => {
    const rows = db.prepare('SELECT * FROM items ORDER BY id DESC').all();
    expect(Array.isArray(rows)).toBe(true);
  });

  it('deleta um item', () => {
    const info = db.prepare('INSERT INTO items (name) VALUES (?)').run('to-delete');
    const del = db.prepare('DELETE FROM items WHERE id = ?').run(info.lastInsertRowid);
    expect(del.changes).toBe(1);
  });
});
