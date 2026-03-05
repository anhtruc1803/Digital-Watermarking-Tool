import { Router } from 'express';
import { uploadSingle } from '../middlewares/upload.js';
import { embedWatermark, extractWatermark } from '../services/watermark/index.js';

const r = Router();

r.post('/embed', uploadSingle, async (req, res, next) => {
  try {
    const message = req.body.message || '';
    const algo = req.body.algo || req.query.algo || 'lsb_v2';
    if (!req.file || !message) return res.status(400).json({ error: 'image and message are required' });
    const out = await embedWatermark(req.file.buffer, message, algo);
    res.setHeader('Content-Type', 'image/png');
    res.send(out);
  } catch (e) {
    const msg = e?.message || '';
    if (msg.includes('Message too long') || msg.includes('not implemented') || msg.includes('must not be empty')) {
      return res.status(400).json({ error: msg });
    }
    next(e);
  }
});

r.post('/extract', uploadSingle, async (req, res, next) => {
  try {
    const algo = req.body.algo || req.query.algo || 'lsb_v2';
    if (!req.file) return res.status(400).json({ error: 'image is required' });
    const message = await extractWatermark(req.file.buffer, algo);
    res.json({ message });
  } catch (e) {
    const msg = e?.message || '';
    if (msg.includes('No valid watermark') || msg.includes('not implemented')) {
      return res.status(400).json({ error: msg });
    }
    next(e);
  }
});

export default r;
