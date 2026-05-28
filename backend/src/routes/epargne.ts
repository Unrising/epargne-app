import { Router, Response } from 'express';
import prisma from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const param = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value || '';

router.use(authenticateToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const epargnes = await prisma.epargne.findMany({
      where: { userId: req.userId },
      include: { economies: true },
    });

    const formatted = epargnes.map((e) => ({
      id: e.id,
      nom: e.nom,
      montant: e.montant,
      courant: e.courant,
      notes: e.notes || '',
      couleurs: e.couleurs || '#2563eb',
      liens: e.liens || '',
      economie: e.economies
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch epargnes' });
  }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);

  try {
    const epargne = await prisma.epargne.findFirst({
      where: { id, userId: req.userId },
      include: { economies: true }
    });

    if (!epargne) return res.status(404).json({ error: 'Epargne not found' });
    res.json(epargne);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch epargne' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, courant, notes, couleurs, liens } = req.body;
  try {
    const newEpargne = await prisma.epargne.create({
      data: {
        nom,
        montant: Number(montant),
        courant: Number(courant),
        notes: notes || '',
        couleurs: couleurs || '#2563eb',
        liens: liens || '',
        userId: req.userId!
      }
    });
    res.status(201).json(newEpargne);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create epargne' });
  }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { nom, montant, courant, notes, couleurs, liens } = req.body;
  const id = param(req.params.id);

  try {
    const updated = await prisma.epargne.updateMany({
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

    if (updated.count === 0) return res.status(404).json({ error: 'Epargne not found or unauthorized' });
    res.json({ message: 'Epargne updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update epargne' });
  }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const id = param(req.params.id);

  try {
    const deleted = await prisma.epargne.deleteMany({
      where: { id, userId: req.userId }
    });

    if (deleted.count === 0) return res.status(404).json({ error: 'Epargne not found or unauthorized' });
    res.json({ message: 'Epargne deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete epargne' });
  }
});

router.post('/:id/economie', async (req: AuthenticatedRequest, res: Response) => {
  const epargneId = param(req.params.id);
  const { nom, montant, notes, liens } = req.body;

  try {
    const parent = await prisma.epargne.findFirst({
      where: { id: epargneId, userId: req.userId }
    });
    if (!parent) return res.status(403).json({ error: 'Unauthorized parent modification' });

    const amount = Number(montant);
    const newEconomie = await prisma.$transaction(async (tx: any) => {
      const economie = await tx.economie.create({
        data: {
          nom,
          montant: amount,
          notes: notes || '',
          liens: liens || '',
          epargneId
        }
      });

      await tx.epargne.update({
        where: { id: epargneId },
        data: { courant: { increment: amount } }
      });

      return economie;
    });
    res.status(201).json(newEconomie);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add economie' });
  }
});

router.delete('/:id/economie/:economieId', async (req: AuthenticatedRequest, res: Response) => {
  const epargneId = param(req.params.id);
  const economieId = param(req.params.economieId);

  try {
    const parent = await prisma.epargne.findFirst({
      where: { id: epargneId, userId: req.userId }
    });
    if (!parent) return res.status(403).json({ error: 'Unauthorized parent modification' });

    const economie = await prisma.economie.findFirst({
      where: { id: economieId, epargneId }
    });
    if (!economie) return res.status(404).json({ error: 'Economie not found' });

    await prisma.$transaction([
      prisma.economie.delete({ where: { id: economieId } }),
      prisma.epargne.update({
        where: { id: epargneId },
        data: { courant: { decrement: economie.montant } }
      })
    ]);

    res.json({ message: 'Economie deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete economie' });
  }
});

export default router;
