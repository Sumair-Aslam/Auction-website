import { BadRequestError, currentUser } from '@jjmauction/common';
import express, { Request, Response } from 'express';
import keccak256 from 'keccak256';

import { Kyc, User } from '../models';

// const keccak256 = require('keccak256');

const router = express.Router();

router.post(
  '/api/auth/kyc',
  currentUser,
  async (req: Request, res: Response) => {
    let clientId = 'scytalelabs_cc0d2';
    if (!req.currentUser) {
      return res.send(null);
    }

    const currentUser = await User.findOne({
      attributes: { exclude: ['password'] },
      where: { id: req.currentUser.id },
    });

    if (currentUser === null) {
      throw new BadRequestError('User not found for KYC');
    }

    if (req.body.clientId !== clientId) {
      throw new BadRequestError('Invalid client Id');
    }

    if (req.body.status === 'approved' && currentUser !== null) {
      const kyc = await Kyc.create({
        userId: req.currentUser.id,
        guid: req.body.guid,
        status: req.body.status,
        clientId: req.body.clientId,
        event: req.body.event,
        recordId: req.body.recordId,
        refId: req.body.refId,
        submitCount: req.body.submitCount,
        blockPassID: req.body.blockPassID,
        isArchived: req.body.isArchived,
        inreviewDate: req.body.inreviewDate,
        waitingDate: req.body.waitingDate,
        approvedDate: req.body.approvedDate,
        isPing: req.body.isPing,
        env: req.body.env,
        webhookId: req.body.webhookId,
      });

      let hashGuid = keccak256(req.body.guid).toString('hex');
      let hashStatus = keccak256(req.body.status).toString('hex');
      let hashClientId = keccak256(req.body.clientId).toString('hex');
      let hashEvent = keccak256(req.body.event).toString('hex');
      let hashRecordId = keccak256(req.body.recordId).toString('hex');
      let hashRefId = keccak256(req.body.refId).toString('hex');
      let hashSubmitCount = keccak256(req.body.submitCount).toString('hex');
      let hashBlockPassID = keccak256(req.body.blockPassID).toString('hex');
      let hashIsArchived = keccak256(req.body.isArchived).toString('hex');
      let hashInreviewDate = keccak256(req.body.inreviewDate).toString('hex');
      let hashWaitingDate = keccak256(req.body.waitingDate).toString('hex');
      let hashApprovedDate = keccak256(req.body.approvedDate).toString('hex');
      let hashIsPing = keccak256(req.body.isPing).toString('hex');
      let hashEnv = keccak256(req.body.env).toString('hex');
      let hashWebhookId = keccak256(req.body.webhookId).toString('hex');

      currentUser.isRegister = true;
    } else {
      throw new BadRequestError('User not registered');
    }

    res.status(201).send(currentUser);
  }
);

export { router as blockpassKyc };
