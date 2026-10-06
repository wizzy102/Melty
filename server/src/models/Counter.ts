import { Schema, model } from 'mongoose';

/** Atomic sequence generator (used for human-friendly order numbers). */
const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = model('Counter', CounterSchema);

/** Returns offset + 1, offset + 2, … atomically, even under concurrent requests. */
export async function nextSequence(name: string, offset = 1000): Promise<number> {
  const doc = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true },
  );
  return offset + doc!.seq;
}
