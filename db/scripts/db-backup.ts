import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import config from '../mikro-orm.config';

// 1. Resolve project directories
const projectRoot = process.cwd();
const backupsDir = path.resolve(projectRoot, 'backups');

// 2. Helper to load environment variables from .env files if not already exported
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

loadEnvFile(path.resolve(projectRoot, '.env'));
loadEnvFile(path.resolve(projectRoot, '.env.local'));

// Resolve DATABASE_URL from environment or fallback to config clientUrl
const databaseUrl =
  process.env.DATABASE_URL ||
  (typeof (config as { getClientUrl?: () => string }).getClientUrl === 'function'
    ? (config as { getClientUrl: () => string }).getClientUrl()
    : (config as { clientUrl?: string }).clientUrl);

// 3. Validate configuration
if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL is not defined in environment variables or .env file.');
  console.error('Please configure DATABASE_URL in your .env or .env.local before running db:backup.');
  process.exit(1);
}

// 4. Ensure backups directory exists
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// 5. Generate timestamped backup filename (e.g. backup_YYYY-MM-DD_HH-mm-ss.dump)
const now = new Date();
const pad = (n: number) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
const dumpFileName = `backup_${timestamp}.dump`;
const dumpFilePath = path.join(backupsDir, dumpFileName);

console.log('📦 Starting PostgreSQL database backup...');
console.log(`📂 Output destination: ${dumpFilePath}`);

// 6. Execute pg_dump with custom format (--format=custom)
const pgDumpArgs = [
  `--dbname=${databaseUrl}`,
  '--format=custom',
  `--file=${dumpFilePath}`,
  '--verbose',
];

const child = spawn('pg_dump', pgDumpArgs, {
  stdio: ['inherit', 'inherit', 'pipe'],
  env: {
    ...process.env,
    PGSSLMODE: process.env.PGSSLMODE || 'require',
  },
});

child.stderr?.pipe(process.stderr);

child.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'ENOENT') {
    console.error('\n❌ Error: pg_dump command was not found in your PATH.');
    console.error('Please install PostgreSQL client tools:');
    console.error('  - On Debian/Ubuntu: sudo apt install postgresql-client');
    console.error('  - On Fedora/RHEL:   sudo dnf install postgresql');
    console.error('  - On Alpine:        apk add postgresql-client');
  } else {
    console.error('\n❌ Failed to spawn pg_dump process:', err.message);
  }
  process.exit(1);
});

child.on('close', (code: number | null) => {
  if (code !== 0) {
    console.error(`\n❌ pg_dump exited with error code ${code}`);
    // Clean up empty or broken file if left behind
    if (fs.existsSync(dumpFilePath)) {
      try {
        const stats = fs.statSync(dumpFilePath);
        if (stats.size === 0) {
          fs.unlinkSync(dumpFilePath);
        }
      } catch {}
    }
    process.exit(code ?? 1);
  }

  const stats = fs.statSync(dumpFilePath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Database backup completed successfully!`);
  console.log(`📁 File: ${dumpFileName} (${sizeMb} MB)`);
  console.log(`📍 Path: ${dumpFilePath}`);
});
