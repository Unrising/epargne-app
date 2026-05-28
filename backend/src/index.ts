import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import epargneRoutes from './routes/epargne';
import depenseRoutes from './routes/depense';
import communRoutes from './routes/commun';
import salaireRoutes from './routes/salaire';
import depenseFixeRoutes from './routes/depenseFixe';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

// Public Auth Endpoints
app.use('/v1/auth', authRoutes);

// Budget Endpoints (Internally protected via middleware)
app.use('/v1/epargne', epargneRoutes);
app.use('/v1/depense', depenseRoutes);
app.use('/v1/commun', communRoutes);
app.use('/v1/salaire', salaireRoutes);
app.use('/v1/depense-fixe', depenseFixeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Secure API running on http://localhost:${PORT}`);
});
