import { PrismaClient } from '@prisma/client';
import * as TE from 'fp-ts/lib/TaskEither.js';
import type { NodeRepo } from '../../port/out/NodeRepo.js';

export class PrismaNodeRepo implements NodeRepo {
    constructor(private prisma: PrismaClient) { }
}
