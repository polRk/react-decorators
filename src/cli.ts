#!/usr/bin/env node
import * as Listr from 'listr'
import * as execa from 'execa'
import * as path from 'path'
import { Observable } from 'rxjs'
import * as fs from 'fs'

let npmConfig: {
  version: string
  main: string
  scripts?: {
    [key: string]: string
  }
  dependencies?: {
    [key: string]: string
  }
  devDependencies?: {
    [key: string]: string
  }
  husky?: {
    hooks?: { [key: string]: string }
  }
  'lint-staged'?: { [key: string]: string | string[] }
}

const jsonSave = (obj: object) => JSON.stringify(obj, undefined, 2)

const tasks = new Listr([
  {
    title: 'Creating directories',
    task: () => execa('mkdir', ['src', 'lib']),
  },
  {
    title: 'Creating source files',
    task: () => execa('touch', ['src/index.tsx']),
  },
  {
    title: 'Creating configuration files',
    task: () =>
      new Observable(observer => {
        observer.next('.prettierrc')
        fs.writeFile(
          path.join(process.cwd(), '.prettierrc'),
          jsonSave({
            trailingComma: 'es5',
            printWidth: 120,
            tabWidth: 2,
            useTabs: false,
            parser: 'typescript',
            semi: false,
            singleQuote: true,
          }),
          err => err && observer.error(err)
        )

        observer.next('tsconfig.json')
        fs.writeFile(
          path.join(process.cwd(), 'tsconfig.json'),
          jsonSave({
            compilerOptions: {
              experimentalDecorators: true,
              target: 'es5',
              lib: ['esnext'],
              module: 'commonjs',
              declaration: true,
              outDir: './lib',
              strict: true,
              strictNullChecks: true,
            },
            include: ['src'],
          }),
          err => err && observer.error(err)
        )

        observer.next('tslint.json')
        fs.writeFile(
          path.join(process.cwd(), 'tslint.json'),
          jsonSave({
            extends: ['tslint-config-airbnb', 'tslint-plugin-prettier', 'tslint-config-prettier'],
            rules: { prettier: true },
          }),
          err => err && observer.error(err)
        )

        observer.next('.gitignore')
        fs.writeFile(
          path.join(process.cwd(), '.gitignore'),
          [
            'node_modules/',
            'lib/',
            '.env',
            '.idea',
            'coverage',
            'npm-debug.log*',
            'yarn-debug.log*',
            'yarn-error.log*',
          ].join('\n'),
          err => err && observer.error(err)
        )

        observer.complete()
      }),
  },
  {
    title: 'Creating package.json',
    task: () =>
      new Observable(observer => {
        observer.next('general')
        npmConfig = {
          ...npmConfig,
          version: '1.0.0',
          main: 'lib/index.js',
          scripts: {
            start: 'node lib/index.js',
            build: 'tsc',
            lint: 'tslint -p ./tsconfig.json && tsc --noEmit',
            test: 'jest',
          },
        }

        observer.next('dependencies')
        npmConfig = {
          ...npmConfig,
          dependencies: {},
          devDependencies: {
            '@types/jest': '^24.0.11',
            '@types/node': '^11.13.5',
            jest: '^24.7.1',
            husky: '^1.3.1',
            'lint-staged': '^8.1.5',
            prettier: '^1.17.0',
            tslint: '^5.16.0',
            'tslint-config-airbnb': '^5.11.1',
            'tslint-config-prettier': '^1.18.0',
            'tslint-plugin-prettier': '^2.0.1',
            typescript: '^3.3.3',
          },
        }

        observer.next('hooks')
        npmConfig = {
          ...npmConfig,
          husky: {
            hooks: {
              'pre-commit': 'lint-staged',
              'post-commit': 'git update-index -g',
            },
          },
          'lint-staged': {
            '*.{js,jsx,ts,tsx,css,scss,json,md}': ['prettier --write', 'git add'],
          },
        }

        fs.writeFile(path.join(process.cwd(), 'package.json'), jsonSave(npmConfig), err => err && observer.error(err))
        observer.complete()
      }),
  },
  {
    title: 'Installing dependencies',
    task: () => execa('npm', ['install']),
  },
  {
    title: 'Running lint',
    task: () => execa('npm', ['run', 'lint']),
  },
  {
    title: 'Running tests',
    task: () => execa('npm', ['run', 'test']),
  },
])

tasks.run().catch(() => {})
