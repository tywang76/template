import { readFileSync, writeFileSync } from 'node:fs';

const env = readFileSync('.env', 'utf8')
    .split('\n')
    .reduce((acc, line) => {
        const [k, ...v] = line.split('=');
        if (k?.trim()) acc[k.trim()] = v.join('=').trim();
        return acc;
    }, {});

const name = env.APP_NAME;
if (!name) {
    console.error('APP_NAME not set in .env');
    process.exit(1);
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg.name = name;
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(`✓ package.json name set to '${name}'`);
