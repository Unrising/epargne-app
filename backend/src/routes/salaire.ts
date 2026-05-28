import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const param = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value || '';

router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const salaires = await prisma.salaire.findMany({
      where: { userId: req.userId },
      orderBy: { mois: 'desc' },
    });
    res.json(salaires);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salaries' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, mois, notes } = req.body;

  if (!nom || !montant || !mois) {
    return res.status(400).json({ error: 'Nom, montant and mois are required' });
  }

  try {
    const salaire = await prisma.salaire.create({
      data: {
        nom,
        montant: Number(montant),
        mois: new Date(mois),
        notes: notes || '',
        userId: req.userId!,
      },
    });
    res.status(201).json(salaire);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create salary' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);

  try {
    const deleted = await prisma.salaire.deleteMany({
      where: { id, userId: req.userId },
    });
    if (deleted.count === 0) return res.status(404).json({ error: 'Salary not found or unauthorized' });
    res.json({ message: 'Salary deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete salary' });
  }
});

export default router;
