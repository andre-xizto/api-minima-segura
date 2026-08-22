import { Router } from 'express';
import db from '../db.js';
import { validateItem } from '../middleware/validate.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(db.prepare('SELECT * FROM items ORDER BY id DESC').all());
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id inválido' });
  }
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  if (!item) return res.status(404).json({ error: 'não encontrado' });
  res.json(item);
});

router.post('/', validateItem, (req, res) => {
  const info = db.prepare('INSERT INTO items (name) VALUES (?)').run(req.body.name);
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'id inválido' });
  }
  const info = db.prepare('DELETE FROM items WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'não encontrado' });
  res.status(204).end();
});

export default router;
