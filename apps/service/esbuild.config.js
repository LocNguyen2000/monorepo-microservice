const path = require('path');
const { build } = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');
const fs = require('fs');

const optionalRequirePackages = [
  '@fastify/static',
  '@fastify/view',
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/platform-express',
  '@nestjs/websockets/socket-module',
  '@nestjs/websockets',
  'express',
  '@aws-sdk/client-dynamodb',
  '@aws-sdk/lib-dynamodb',
  'amqp-connection-manager',
  'amqplib',
  'cache-manager',
  'cache-manager/package.json',
  'class-transformer',
  'class-validator',
  'hbs',
  'ioredis',
  'kafkajs',
  'mqtt',
  'nats',
  'pg-hstore',
];

const workspacePackages = {
  '@nhl/env': path.resolve(__dirname, '../../packages/env/src'),
  '@nhl/error': path.resolve(__dirname, '../../packages/error/src'),
};

async function bundle() {
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });

  const result = await build({
    absWorkingDir: __dirname,
    entryPoints: ['src/main.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    target: 'node16',
    splitting: false,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    sourcemap: 'external',
    plugins: [
      {
        name: 'workspace-packages',
        setup(buildContext) {
          buildContext.onResolve(
            { filter: /^@nhl\/(env|error)(\/.*)?$/ },
            ({ path: importPath }) => {
              const packageName = importPath.match(/^@nhl\/(env|error)/)[0];
              const subpath = importPath
                .slice(packageName.length)
                .replace(/^\//, '');
              const packagePath = path.join(
                workspacePackages[packageName],
                subpath,
              );
              const filePath = `${packagePath}.ts`;
              return {
                path: subpath
                  ? fs.existsSync(filePath)
                    ? filePath
                    : path.join(packagePath, 'index.ts')
                  : path.join(workspacePackages[packageName], 'index.ts'),
              };
            },
          );
        },
      },
      esbuildDecorators({
        tsconfig: path.join(__dirname, 'tsconfig.json'),
        cwd: __dirname,
      }),
    ],
    external: optionalRequirePackages,
  });

  if (!result.errors.length) {
    console.log('Built successfully!');
    return;
  }

  console.error(result.errors[0]);
  process.exitCode = 1;
}

bundle().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
