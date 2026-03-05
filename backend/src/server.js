import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import healthRouter from './routes/health.js';
import watermarkRouter from './routes/watermark.js';
import { errorHandler } from './middlewares/errors.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/watermark', watermarkRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendDir));
app.get('/', (_, res) => res.sendFile(path.join(frontendDir, 'index.html')));

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on :${port}`));
