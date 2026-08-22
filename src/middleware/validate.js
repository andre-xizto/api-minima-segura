export function validateItem(req, res, next) {
  const { name } = req.body ?? {};
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return res.status(400).json({ error: 'name é obrigatório (string, 1-100 caracteres)' });
  }
  req.body.name = name.trim();
  next();
}
