import { Router } from 'express';
import { uploadSingle } from '../middlewares/upload.js';
import { embedWatermark, extractWatermark } from '../services/watermark/index.js';

const r = Router();

r.post('/embed', uploadSingle, async (req, res, next) => {
  try {
    const message = req.body.message || '';
    if (!req.file || !message) return res.status(400).json({ error: 'image and message are required' });
    const out = await embedWatermark(req.file.buffer, message);
    res.setHeader('Content-Type', 'image/png');
    res.send(out);
  } catch (e) { next(e); }
});

r.post('/extract', uploadSingle, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image is required' });
    const message = await extractWatermark(req.file.buffer);
    res.json({ message });
  } catch (e) { next(e); }
});

export default r;
