const spawn = require('cross-spawn');
const path = require('path');
const fs = require('fs-extra');

const rootPath = path.resolve(__dirname, '..');
const clientPath = path.join(rootPath, 'client');
const distPath = path.join(clientPath, 'dist');
const publicPath = path.join(rootPath, 'server', 'public');
const storagePath = path.join(rootPath, 'server', 'storage');

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { cwd });

    process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.error(data.toString()));

    process.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

async function copyBuildFiles() {
  try {
    const storageExists = await fs.pathExists(storagePath);
    if (storageExists) {
      console.log('Storage directory exists, preserving it.');
    }

    await fs.emptyDir(publicPath);

    if (storageExists) {
      await fs.ensureDir(storagePath);
    }

    const items = await fs.readdir(distPath);

    for (const item of items) {
      if (item !== 'index.html') {
        const srcPath = path.join(distPath, item);
        const destPath = path.join(publicPath, item);
        await fs.copy(srcPath, destPath);
      }
    }

    console.log('Build files copied to public directory successfully.');
  } catch (error) {
    console.error('Error copying build files:', error);
  }
}

async function buildAndPrepare() {
  try {
    console.log('Running npm run build in the client directory...');
    await runCommand('npm', ['run', 'build'], clientPath);
    console.log('Build completed successfully.');
    await copyBuildFiles();
    console.log('Running php artisan storage:link...');
    await runCommand('php', ['artisan', 'storage:link'], path.join(rootPath, 'server'));
    console.log('php artisan storage:link completed successfully.');
  } catch (error) {
    console.error('Build and prepare process failed:', error);
  }
}

// Execute the build and prepare function
buildAndPrepare();
