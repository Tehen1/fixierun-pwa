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
  console.log(`\nUsage:\n  ${CLI_NAME} <command> [options]\n\nCommands:\n  init              Initialize local stack templates (.env, docker compose)\n  plan              Scaffold Terraform & Helm; run terraform plan if available\n  deploy            Deploy local stack with Docker Compose\n  k8s-deploy        Deploy Helm chart to Kubernetes (requires helm & kubectl)\n  k8s-status        Show Kubernetes pods for the release namespace\n  status            Show Docker status for the stack\n  help              Show this help\n\nOptions:\n  --target-dir <dir>    Target directory for stack files (default: ./portfolio-stack)\n  --skip-checks         Skip environment preflight checks\n  --namespace <ns>      Kubernetes namespace (default: portfolio)\n  --release <name>      Helm release name (default: portfolio)\n  --image-repo <repo>   Override image repository for Helm deploy\n  --image-tag <tag>     Override image tag for Helm deploy\n`);
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
    } else if (token === '--namespace') {
      args.namespace = argv[i + 1];
      i += 1;
    } else if (token === '--release') {
      args.release = argv[i + 1];
      i += 1;
    } else if (token === '--image-repo') {
      args.imageRepo = argv[i + 1];
      i += 1;
    } else if (token === '--image-tag') {
      args.imageTag = argv[i + 1];
      i += 1;
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

function detectTerraform() {
  if (commandExists('terraform', ['version'])) return 'terraform';
  return null;
}

function detectHelm() {
  if (commandExists('helm', ['version'])) return 'helm';
  return null;
}

function detectKubectl() {
  if (commandExists('kubectl', ['version', '--client'])) return 'kubectl';
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

function scaffoldTerraform(targetDir) {
  const templatesDir = getTemplatesDir();
  const tfSrcDir = path.join(templatesDir, 'terraform');
  const tfDestDir = path.join(targetDir, 'terraform');
  fs.mkdirSync(tfDestDir, { recursive: true });
  const files = ['main.tf', 'providers.tf', 'variables.tf', 'outputs.tf'];
  for (const f of files) {
    const src = path.join(tfSrcDir, f);
    const dest = path.join(tfDestDir, f);
    copyFileIfAbsent(src, dest);
  }
  return tfDestDir;
}

function scaffoldHelm(targetDir) {
  const templatesDir = getTemplatesDir();
  const helmSrcDir = path.join(templatesDir, 'helm');
  const helmDestDir = path.join(targetDir, 'helm');
  // copy Chart.yaml, values.yaml, templates/
  fs.mkdirSync(path.join(helmDestDir, 'templates'), { recursive: true });
  const files = ['Chart.yaml', 'values.yaml'];
  for (const f of files) {
    const src = path.join(helmSrcDir, f);
    const dest = path.join(helmDestDir, f);
    copyFileIfAbsent(src, dest);
  }
  const tmplFiles = ['deployment.yaml', 'service.yaml'];
  for (const f of tmplFiles) {
    const src = path.join(helmSrcDir, 'templates', f);
    const dest = path.join(helmDestDir, 'templates', f);
    copyFileIfAbsent(src, dest);
  }
  return helmDestDir;
}

function cmdPlan(options) {
  const targetDir = path.resolve(process.cwd(), options.targetDir || 'portfolio-stack');
  fs.mkdirSync(targetDir, { recursive: true });
  const tfDir = scaffoldTerraform(targetDir);
  const helmDir = scaffoldHelm(targetDir);
  console.log(`Scaffolded Terraform at: ${tfDir}`);
  console.log(`Scaffolded Helm chart at: ${helmDir}`);

  const terraformCmd = detectTerraform();
  if (!terraformCmd) {
    console.log('Terraform not found; skipping plan. You can install Terraform and rerun plan.');
    return;
  }
  try {
    console.log('Running terraform init...');
    run(terraformCmd, ['init', '-input=false', '-no-color'], { cwd: tfDir });
    console.log('Running terraform plan...');
    run(terraformCmd, ['plan', '-no-color'], { cwd: tfDir });
  } catch (e) {
    console.error(`Terraform plan failed: ${e.message}`);
  }
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

function cmdK8sDeploy(options) {
  const targetDir = path.resolve(process.cwd(), options.targetDir || 'portfolio-stack');
  const helmCmd = detectHelm();
  if (!helmCmd) {
    console.error('Helm not found. Install helm to use k8s-deploy.');
    return;
  }
  const kubectlCmd = detectKubectl();
  if (!kubectlCmd) {
    console.error('kubectl not found. Install kubectl to use k8s-deploy.');
    return;
  }

  const namespace = options.namespace || 'portfolio';
  const release = options.release || 'portfolio';
  const helmDir = path.join(targetDir, 'helm');
  if (!fs.existsSync(helmDir)) {
    console.error(`Helm chart not found at ${helmDir}. Run '${CLI_NAME} plan' first.`);
    return;
  }

  const helmArgs = ['upgrade', '--install', release, helmDir, '-n', namespace, '--create-namespace'];
  if (options.imageRepo) {
    helmArgs.push('--set', `image.repository=${options.imageRepo}`);
  }
  if (options.imageTag) {
    helmArgs.push('--set', `image.tag=${options.imageTag}`);
  }
  console.log(`Deploying Helm release '${release}' to namespace '${namespace}'...`);
  run(helmCmd, helmArgs);
  console.log('Helm deploy complete. Current pods:');
  run(kubectlCmd, ['get', 'pods', '-n', namespace]);
}

function cmdK8sStatus(options) {
  const kubectlCmd = detectKubectl();
  if (!kubectlCmd) {
    console.error('kubectl not found. Install kubectl to use k8s-status.');
    return;
  }
  const namespace = options.namespace || 'portfolio';
  run(kubectlCmd, ['get', 'pods', '-n', namespace]);
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
      case 'plan':
        cmdPlan(args);
        break;
      case 'deploy':
        cmdDeploy(args);
        break;
      case 'k8s-deploy':
        cmdK8sDeploy(args);
        break;
      case 'k8s-status':
        cmdK8sStatus(args);
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

