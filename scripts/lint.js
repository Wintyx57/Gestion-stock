const { spawnSync } = require('child_process');

function exists(cmd) {
  const res = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
  return !res.error && res.status === 0;
}

if (exists('expo')) {
  spawnSync('expo', ['lint'], { stdio: 'inherit' });
} else {
  console.log('Expo CLI not available. Skipping lint.');
}
