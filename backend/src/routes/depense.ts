import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const param = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value || '';

router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await prisma.depenseCategory.findMany({
      where: { userId: req.userId },
      include: { depenses: true }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, courant, notes, couleurs, liens } = req.body;
  try {
    const category = await prisma.depenseCategory.create({
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
    res.status(400).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, courant, notes, couleurs, liens } = req.body;
  const id = param(req.params.id);

  try {
    const updated = await prisma.depenseCategory.updateMany({
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
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);

  try {
    const deleted = await prisma.depenseCategory.deleteMany({
      where: { id, userId: req.userId }
    });
    if (deleted.count === 0) return res.status(404).json({ error: 'Category not found or unauthorized' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete category' });
  }
});

router.post('/:id/item', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, notes, liens } = req.body;
  const id = param(req.params.id);

  try {
    const parent = await prisma.depenseCategory.findFirst({
      where: { id, userId: req.userId }
    });
    if (!parent) return res.status(403).json({ error: 'Unauthorized parent modification' });

    const amount = Number(montant);
    const item = await prisma.$transaction(async (tx: any) => {
      const depense = await tx.depense.create({
        data: {
          nom,
          montant: amount,
          notes: notes || '',
          liens: liens || '',
          categoryId: id
        }
      });

      await tx.depenseCategory.update({
        where: { id },
        data: { courant: { increment: amount } }
      });

      return depense;
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add expense item' });
  }
});

router.delete('/:id/item/:itemId', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);
  const itemId = param(req.params.itemId);

  try {
    const parent = await prisma.depenseCategory.findFirst({
      where: { id, userId: req.userId }
    });
    if (!parent) return res.status(403).json({ error: 'Unauthorized parent modification' });

    const item = await prisma.depense.findFirst({
      where: { id: itemId, categoryId: id }
    });
    if (!item) return res.status(404).json({ error: 'Expense item not found' });

    await prisma.$transaction([
      prisma.depense.delete({ where: { id: itemId } }),
      prisma.depenseCategory.update({
        where: { id },
        data: { courant: { decrement: item.montant } }
      })
    ]);

    res.json({ message: 'Expense item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete expense item' });
  }
});

export default router;
