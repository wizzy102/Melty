/**
 * Usage: npm run hash-password -- "new-admin-password"
 * Paste the printed hash into ADMIN_PASSWORD_HASH in server/.env.
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error('Usage: npm run hash-password -- "password (min 8 chars)"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(hash);
console.log('\nNote: in .env, wrap the hash in single quotes so "$" is not interpreted.');
