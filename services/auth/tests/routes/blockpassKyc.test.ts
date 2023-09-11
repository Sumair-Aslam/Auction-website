import request from 'supertest';

import { app } from '../../src/app';
// import { Kyc, User } from '../../src/models';
import { natsWrapper } from '../../src/nats-wrapper';
import { signup } from '../signin-helper';

it('returns 201 on the successfull kyc process', async () => {
  await signup();

  const response = await request(app).post('/api/auth/kyc').send({
    guid: '61f774e4b867be00135a6bab',
    status: 'approved',
    clientId: 'scytalelabs_cc0d2',
    event: 'review.approved',
    recordId: '61c39ad0ff92c8001383ddb0',
    refId: '1640207737771',
    submitCount: 1,
    blockPassID: '61c3984dcdb6930012dd228f',
    isArchived: false,
    inreviewDate: '2021-12-22T21:45:19.693Z',
    waitingDate: '2021-12-22T21:44:06.666Z',
    approvedDate: '2021-12-22T21:46:39.338Z',
    isPing: false,
    env: 'prod',
    webhookId: null,
  });

  expect(201);
});

it('returns 400 if the user not found', async () => {
  // await signup();

  await request(app).post('/api/auth/kyc').send({
    guid: '61f774e4b867be00135a6bab',
    status: 'approved',
    clientId: 'scytalelabs_cc0d2',
    event: 'review.approved',
    recordId: '61c39ad0ff92c8001383ddb0',
    refId: '1640207737771',
    submitCount: 1,
    blockPassID: '61c3984dcdb6930012dd228f',
    isArchived: false,
    inreviewDate: '2021-12-22T21:45:19.693Z',
    waitingDate: '2021-12-22T21:44:06.666Z',
    approvedDate: '2021-12-22T21:46:39.338Z',
    isPing: false,
    env: 'prod',
    webhookId: null,
  });

  expect(400);
});

it('returns 201 on the successfull kyc', async () => {
  await signup();

  await request(app).post('/api/auth/kyc').send({
    guid: '61f774e4b867be00135a6bab',
    status: 'approved',
    clientId: 'scytalelab',
    event: 'review.approved',
    recordId: '61c39ad0ff92c8001383ddb0',
    refId: '1640207737771',
    submitCount: 1,
    blockPassID: '61c3984dcdb6930012dd228f',
    isArchived: false,
    inreviewDate: '2021-12-22T21:45:19.693Z',
    waitingDate: '2021-12-22T21:44:06.666Z',
    approvedDate: '2021-12-22T21:46:39.338Z',
    isPing: false,
    env: 'prod',
    webhookId: null,
  });

  expect(400);
});
