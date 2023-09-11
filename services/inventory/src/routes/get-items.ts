import express, { Request, Response } from 'express';
import { Sequelize } from 'sequelize';

import { Inventory } from '../models';

const router = express.Router();

router.get('/api/inventory', async (req: Request, res: Response) => {
  const search = req.query.search || '';

  const items = search
    ? await Inventory.findAll({
        attributes: {
          include: [
            [
              Sequelize.literal(
                `MATCH (title) AGAINST('${search}' IN NATURAL LANGUAGE MODE)`
              ),
              'score',
            ],
          ],
        },
        where: Sequelize.literal(
          `MATCH (title) AGAINST('${search}' IN NATURAL LANGUAGE MODE)`
        ),
        order: [[Sequelize.literal('score'), 'DESC']],
      })
    : await Inventory.findAll();

  res.status(200).send(items);
});

export { router as getItemsRouter };
