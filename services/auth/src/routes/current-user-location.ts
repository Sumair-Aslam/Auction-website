// import { currentUser } from '@jjmauction/common';
import express, { Request, Response } from 'express';

// import { User } from '../models';

const router = express.Router();

router.get(
  '/api/auth/current-user-location',
  /*currentUser,*/
  async (req: Request, res: Response) => {
    // if (!req.currentUser) {
    //   return res.send(null);
    // }

    // const currentUser = await User.findOne({
    //   attributes: { exclude: ['password'] },
    //   where: { id: req.currentUser.id },
    // });

    let ip = req.socket.remoteAddress; //https://www.educative.io/edpresso/how-to-get-the-ip-address-of-a-client-in-nodejs
    let access_key = 'c38df8d343c4fd831f140e6cda32d972'; //https://ipapi.com/quickstart

    const location = 'http://api.ipapi.com/' + ip + '?access_key=' + access_key;

    res.send({ location });
  }
);

export { router as currentUserLocationRouter };
