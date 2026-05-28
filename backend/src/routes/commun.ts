import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const param = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value || '';

router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await prisma.depenseCommunCategory.findMany({
      where: { userId: req.userId },
      include: { depenses: true }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch common categories' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, courant, notes, couleurs, liens } = req.body;
  try {
    const category = await prisma.depenseCommunCategory.create({
      data: {
        nom,
        montant: Number(montant),
        courant: Number(courant),
        notes: notes || '',
        couleurs: couleurs || '',
        liens: liens || '',
        userId: req.userId!
      }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create common category' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, courant, notes, couleurs, liens } = req.body;
  const id = param(req.params.id);

  try {
    const updated = await prisma.depenseCommunCategory.updateMany({
      where: { id, userId: req.userId },
      data: {
        nom,
        montant: montant !== undefined ? Number(montant) : undefined,
        courant: courant !== undefined ? Number(courant) : undefined,
        notes,
        couleurs,
        liens
      }
    });
    if (updated.count === 0) return res.status(404).json({ error: 'Category not found or unauthorized' });
    res.json({ message: 'Common category updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update common category' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);

  try {
    const deleted = await prisma.depenseCommunCategory.deleteMany({
      where: { id, userId: req.userId }
    });
    if (deleted.count === 0) return res.status(404).json({ error: 'Category not found or unauthorized' });
    res.json({ message: 'Common category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete common category' });
  }
});

router.post('/:id/item', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, notes, liens } = req.body;
  const id = param(req.params.id);

  try {
    const parent = await prisma.depenseCommunCategory.findFirst({
      where: { id, userId: req.userId }
    });
    if (!parent) return res.status(403).json({ error: 'Unauthorized parent modification' });

    const amount = Number(montant);
    const item = await prisma.$transaction(async (tx: any) => {
      const depense = await tx.depenseCommun.create({
        data: {
          nom,
          montant: amount,
          notes: notes || '',
          liens: liens || '',
          categoryId: id
        }
      });

      await tx.depenseCommunCategory.update({
        where: { id },
        data: { courant: { increment: amount } }
      });

      return depense;
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add common expense item' });
  }
});

router.delete('/:id/item/:itemId', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);
  const itemId = param(req.params.itemId);

  try {
    const parent = await prisma.depenseCommunCategory.findFirst({
      where: { id, userId: req.userId }
    });
    if (!parent) return res.status(403).json({ error: 'Unauthorized parent modification' });

    const item = await prisma.depenseCommun.findFirst({
      where: { id: itemId, categoryId: id }
    });
    if (!item) return res.status(404).json({ error: 'Common expense item not found' });

    await prisma.$transaction([
      prisma.depenseCommun.delete({ where: { id: itemId } }),
      prisma.depenseCommunCategory.update({
        where: { id },
        data: { courant: { decrement: item.montant } }
      })
    ]);

    res.json({ message: 'Common expense item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete common expense item' });
  }
});

export default router;
