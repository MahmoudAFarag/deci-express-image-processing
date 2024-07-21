import express from 'express';
import path from 'path';
import { imageRoutes } from './routes/imageRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use('/api/images', imageRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
