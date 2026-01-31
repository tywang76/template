import { Router } from 'express';
import { PrismaNodeRepo } from '../out/PrismaNodeRepo.js';
import { prisma } from '../out/prisma.js';

const router = Router();

const prismaNodeRepo = new PrismaNodeRepo(prisma);

router.get('/hi', async (req, res) => {
    res.send("hi")
});

export default router;