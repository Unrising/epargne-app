import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const param = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value || '';

router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const depenses = await prisma.depenseFixe.findMany({
      where: { userId: req.userId },
      orderBy: [{ active: 'desc' }, { jour: 'asc' }, { nom: 'asc' }],
    });
    res.json(depenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixed expenses' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, jour, notes, active } = req.body;

  if (!nom || !montant || !jour) {
    return res.status(400).json({ error: 'Nom, montant and jour are required' });
  }

  const day = Number(jour);
  if (day < 1 || day > 31) {
    return res.status(400).json({ error: 'Jour must be between 1 and 31' });
  }

  try {
    const depense = await prisma.depenseFixe.create({
      data: {
        nom,
        montant: Number(montant),
        jour: day,
        notes: notes || '',
        active: active ?? true,
        userId: req.userId!,
      },
    });
    res.status(201).json(depense);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create fixed expense' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);

  try {
    const deleted = await prisma.depenseFixe.deleteMany({
      where: { id, userId: req.userId },
    });
    if (deleted.count === 0) return res.status(404).json({ error: 'Fixed expense not found or unauthorized' });
    res.json({ message: 'Fixed expense deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete fixed expense' });
  }
});

export default router;
