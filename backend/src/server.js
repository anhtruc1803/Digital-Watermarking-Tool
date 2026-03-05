import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import watermarkRouter from './routes/watermark.js';
import { errorHandler } from './middlewares/errors.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/watermark', watermarkRouter);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend listening on :${port}`));
