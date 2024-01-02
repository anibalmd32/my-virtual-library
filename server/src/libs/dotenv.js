import fs from 'node:fs/promises';
import path from 'node:path';

async function dotenv() {
  const dotenvPath = path.join(process.cwd(), '.env');
  const dotenvFile = await fs.readFile(dotenvPath, 'utf-8');
  const dotenvArr = dotenvFile.trim().split('\n').filter(line => line !== '\r');
  
  dotenvArr.forEach(env => {
    const envArr = env.trim().split('=');
    process.env[envArr[0]] = envArr[1];
  });
}

await dotenv();
