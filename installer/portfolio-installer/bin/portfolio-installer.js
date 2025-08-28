#!/usr/bin/env node

/**
 * Minimal CLI for unified installer: init, deploy, status
 * No external dependencies to simplify bootstrap.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const CLI_NAME = 'portfolio-installer';

function printHeader() {
  console.log(`${CLI_NAME} - unified installer`);
}

function printHelp() {
  console.log(`\nUsage:\n  ${CLI_NAME} <command> [options]\n\nCommands:\n  init              Initialize local stack templates (.env, docker compose)\n  deploy            Deploy local stack with Docker Compose\n  status            Show Docker status for the stack\n  help              Show this help\n\nOptions:\n  --target-dir <dir>    Target directory for stack files (default: ./portfolio-stack)\n  --skip-checks         Skip environment preflight checks\n`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--target-dir') {
      args.targetDir = argv[i + 1];
      i += 1;
    } else if (token === '--skip-checks') {
      args.skipChecks = true;
    } else if (!args.command) {
      args.command = token;
    } else {
      args._.push(token);
    }
  }
  return args;
}

function ensureNodeVersion() {
  const version = process.versions.node || '';
  const major = Number(version.split('.')[0] || '0');
  if (Number.isNaN(major) || major < 18) {
    throw new Error(`Node.js v18+ required. Current: ${version}`);
  }
}

function commandExists(cmd, sub = ['--version']) {
  try {
    const res = spawnSync(cmd, sub, { stdio: 'ignore' });
    return res.status === 0;
  } catch (_) {
    return false;
  }
}

function detectComposeCommand() {
  // Prefer `docker compose`, fallback to `docker-compose`
  if (commandExists('docker', ['compose', 'version'])) return ['docker', ['compose']];
  if (commandExists('docker-compose', ['version'])) return ['docker-compose', []];
  return null;
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (res.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function copyFileIfAbsent(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function writeFileIfAbsent(dest, content) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content, 'utf8');
  }
}

function getTemplatesDir() {
  // Resolve from this file location
  const here = __dirname; // bin/
  return path.join(here, '..', 'templates');
}

function preflightChecks() {
  ensureNodeVersion();
  if (!commandExists('docker', ['--version'])) {
    throw new Error('Docker CLI not found. Please install Docker and ensure it is on PATH.');
  }
  const compose = detectComposeCommand();
  if (!compose) {
    throw new Error('Docker Compose not found. Install Docker Compose v2 (docker compose) or v1 (docker-compose).');
  }
}

function cmdInit(options) {
  if (!options.skipChecks) {
    try {
      preflightChecks();
    } catch (e) {
      console.error(`Preflight warning: ${e.message}`);
      console.error('Proceeding because checks are not strictly required for scaffolding. Use --skip-checks to silence this.');
    }
  }

  const targetDir = path.resolve(process.cwd(), options.targetDir || 'portfolio-stack');
  const templatesDir = getTemplatesDir();
  const composeSrc = path.join(templatesDir, 'docker', 'docker-compose.yml');
  const envExampleSrc = path.join(templatesDir, 'docker', '.env.example');
  const composeDest = path.join(targetDir, 'docker-compose.yml');
  const envDest = path.join(targetDir, '.env');

  copyFileIfAbsent(composeSrc, composeDest);
  // Always write .env if absent, do not overwrite existing
  copyFileIfAbsent(envExampleSrc, envDest);

  console.log(`Initialized local stack at: ${targetDir}`);
  console.log(`  - ${path.relative(process.cwd(), composeDest)}`);
  console.log(`  - ${path.relative(process.cwd(), envDest)}`);
}

function cmdDeploy(options) {
  const targetDir = path.resolve(process.cwd(), options.targetDir || 'portfolio-stack');
  const compose = detectComposeCommand();
  if (!compose) {
    throw new Error('Docker Compose missing. Install Docker Compose v2 or v1.');
  }
  const [composeCmd, composeArgs] = compose;
  const composeFile = path.join(targetDir, 'docker-compose.yml');
  if (!fs.existsSync(composeFile)) {
    throw new Error(`Compose file not found at ${composeFile}. Run '${CLI_NAME} init' first.`);
  }
  console.log(`Deploying local stack using ${composeCmd}...`);
  run(composeCmd, [...composeArgs, '-f', composeFile, 'up', '-d']);
  console.log('Stack is starting. Use status to check health.');
}

function cmdStatus(options) {
  const targetDir = path.resolve(process.cwd(), options.targetDir || 'portfolio-stack');
  const compose = detectComposeCommand();
  if (!compose) {
    console.log('Docker Compose not available; falling back to docker ps');
    run('docker', ['ps']);
    return;
  }
  const [composeCmd, composeArgs] = compose;
  const composeFile = path.join(targetDir, 'docker-compose.yml');
  if (!fs.existsSync(composeFile)) {
    console.log('Compose file missing; showing all containers. Run init first.');
    run('docker', ['ps']);
    return;
  }
  run(composeCmd, [...composeArgs, '-f', composeFile, 'ps']);
}

function main() {
  printHeader();
  const args = parseArgs(process.argv.slice(2));
  const command = args.command || 'help';

  try {
    switch (command) {
      case 'init':
        cmdInit(args);
        break;
      case 'deploy':
        cmdDeploy(args);
        break;
      case 'status':
        cmdStatus(args);
        break;
      case 'help':
      default:
        printHelp();
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();

