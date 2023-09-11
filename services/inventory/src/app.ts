import 'express-async-errors';

// import { NotFoundError, currentUser, errorHandler } from '@jjmauction/common';
import { NotFoundError, currentUser, errorHandler } from 'scytalelabs-auction';

import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import express from 'express';

import { addItemRouter } from './routes/add-item';
import { deleteItemRouter } from './routes/delete-item';
import { getItemRouter } from './routes/get-item';
import { getItemsRouter } from './routes/get-items';
import { updateItemRouter } from './routes/update-item';
import { qrCodeRouter } from './routes/qr-code';
import { getUserItemsRouter } from './routes/get-users-items';
import { directBuyRouter } from './routes/direct_buy';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: false }));
app.use(currentUser);

app.use(addItemRouter);
app.use(getUserItemsRouter);
app.use(deleteItemRouter);
app.use(updateItemRouter);
app.use(getItemRouter);
app.use(getItemsRouter);
app.use(qrCodeRouter);
app.use(directBuyRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
