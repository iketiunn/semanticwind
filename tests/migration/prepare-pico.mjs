import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('node_modules/@picocss/pico/css/pico.classless.css', 'utf8');
await writeFile('tests/migration/pico.fixture.css', source.replace(/^@charset "UTF-8";\n/, ''));
