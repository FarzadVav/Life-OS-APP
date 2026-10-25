import fs from 'node:fs';
import path from 'node:path';

/**
 * Side-effect module: populates process.env from .env / .env.local for the CLI
 * scripts, which run outside Next.js and therefore get no automatic env loading.
 * Must be imported before anything that reads env at module scope.
 */
function loadEnvFile(envPath: string): void {
  if (!fs.existsSync(envPath)) return;
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  } catch (err) {
    console.warn(`⚠️ Warning: Could not read env file at ${envPath}:`, (err as Error).message);
  }
}

const projectRoot = process.cwd();

loadEnvFile(path.resolve(projectRoot, '.env'));
loadEnvFile(path.resolve(projectRoot, '.env.local'));
