import { requireAuth, BadRequestError } from 'scytalelabs-auction';

import express, { Request, Response } from 'express';

import { Inventory } from '../models';

const router = express.Router();

router.get(
  '/api/inventory/me',
  requireAuth,
  async (req: Request, res: Response) => {
    const items = await Inventory.findAll({
      where: { userId: req.currentUser.id },
    });

    if(!items){
      throw new BadRequestError('No item found against this user');
    }

    res.status(200).send(items);
  }
);

export { router as getUserItemsRouter };
