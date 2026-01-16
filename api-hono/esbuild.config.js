import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

/** @type {esbuild.BuildOptions} */
const config = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    outdir: 'dist',
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',

    // Mark external packages (not bundled)
    external: [
        // Node built-ins
        'node:*',
        // Prisma needs to be external (has native bindings)
        '@prisma/client',
        '@prisma/adapter-pg',
        'prisma',
        // pg has native bindings
        'pg',
        'pg-native',
    ],

    // Handle .ts imports
    resolveExtensions: ['.ts', '.js'],

    // Banner for ESM compatibility
    banner: {
        js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`.trim(),
    },
};

async function build() {
    if (isWatch) {
        const ctx = await esbuild.context(config);
        await ctx.watch();
        console.log('Watching for changes...');
    } else {
        await esbuild.build(config);
        console.log('Build complete!');
    }
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});
