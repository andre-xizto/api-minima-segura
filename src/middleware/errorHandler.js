import { config } from '../config.js';

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({
    error: status >= 500 ? 'erro interno' : err.message,
    ...(config.nodeEnv !== 'production' && status >= 500 ? { detail: err.message } : {}),
  });
}
