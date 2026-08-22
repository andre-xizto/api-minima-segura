import app from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`API rodando na porta ${config.port}: (${config.nodeEnv})`);
});
