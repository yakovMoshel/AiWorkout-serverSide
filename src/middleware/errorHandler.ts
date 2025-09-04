import { Request, Response, NextFunction } from 'express';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../api/utils/errors';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Error:', err.message);
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof NotFoundError
  ) {
    res.status((err as any).status).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};
