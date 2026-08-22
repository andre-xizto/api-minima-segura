import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/db.js';

beforeAll(() => {
  db.prepare('DELETE FROM items').run();
});

afterAll(() => {
  db.close();
});

describe('API /health', () => {
  it('retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('API /api/items', () => {
  it('POST cria item e retorna 201', async () => {
    const res = await request(app).post('/api/items').send({ name: 'teste' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('teste');
    expect(res.body.id).toBeDefined();
  });

  it('POST rejeita entrada inválida com 400', async () => {
    const res = await request(app).post('/api/items').send({ name: '' });
    expect(res.status).toBe(400);
  });

  it('POST rejeita name muito longo com 400', async () => {
    const res = await request(app).post('/api/items').send({ name: 'x'.repeat(101) });
    expect(res.status).toBe(400);
  });

  it('GET lista itens', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET item por id', async () => {
    const created = await request(app).post('/api/items').send({ name: 'busca' });
    const res = await request(app).get(`/api/items/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('busca');
  });

  it('GET item inexistente retorna 404', async () => {
    const res = await request(app).get('/api/items/999999');
    expect(res.status).toBe(404);
  });

  it('DELETE item inexistente retorna 404', async () => {
    const res = await request(app).delete('/api/items/999999');
    expect(res.status).toBe(404);
  });

  it('DELETE item existente retorna 204', async () => {
    const created = await request(app).post('/api/items').send({ name: 'remover' });
    const res = await request(app).delete(`/api/items/${created.body.id}`);
    expect(res.status).toBe(204);
  });
});
