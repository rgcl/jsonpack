import { createRequire } from 'module';
const { pack, unpack } = createRequire(import.meta.url)('./index.js');
export { pack, unpack };
