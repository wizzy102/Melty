import { z } from 'zod';
import { badRequest } from './httpError.js';

const OBJECT_ID = /^[a-f\d]{24}$/i;

export const objectId = z.string().regex(OBJECT_ID, 'invalid_id');

export function assertObjectId(id: unknown, code = 'invalid_id'): string {
  if (typeof id !== 'string' || !OBJECT_ID.test(id)) throw badRequest(code);
  return id;
}
