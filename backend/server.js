import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import aiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', aiRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'CodeForge AI API',
    version: '1.0.0',
    endpoints: [
      'POST /api/chat',
      'POST /api/explain',
      'POST /api/fix',
      'POST /api/optimize',
      'POST /api/convert'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeForge AI Backend running on http://localhost:${PORT}`);
});
