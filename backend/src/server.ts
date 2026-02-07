import './utils/log.js';
import app from './app.js';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () =>
    console.log(`API http://localhost:${PORT} (docs at /docs)`)
);
