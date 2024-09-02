# material-ui 분석

(git) https://github.com/mui/material-ui/tree/master
(react 사용 예시) https://github.com/mui/material-ui/blob/master/examples/material-ui-cra-ts

<br/>
<br/>

# 특징

- material-ui는 pnpm, lerna를 이용한 모노레포로 구성됨
  |package.json 위치|private 여부|package 용도|
  |-----|-----|-----|
  |./|true|-|
  |./packages/api-docs-builder-core|true|-|
  |./packages/api-docs-builder|true|-|
  |./packages/eslint-plugin-material-ui|true|-|
  |./packages/feedback/true|-|
  |`./packages/markdown`|`false`|MUI 마크다운 파서로, 내부 패키지임|
  |`./packages/mui-babel-macros`|`false`|MUI 바벨 매크로로, 내부 패키지임|
  |🔥🔥 <br/> `./packages/mui-base`|`false`|`@mui/base - headless(unstyled) react components와 low-level hooks를 가진 라이브러리. @mui/base를 사용하면 앱의 css와 접근성 기능을 완벽히 제어할 수 있음` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-base|
  |`./packages/mui-codemod`|`false`|MUI의 Codemod 스크립트 (Codemod: 코드를 디자인된(미리 정의된) 형태로 자동 변환해주는 도구)|
  |`./packages/mui-docs/`|`false`|MUI Docs|
  |`./packages/mui-envinfo`|`false`|MUI 패키지와 관련된 현재 환경에 대한 정보를 콘솔에 노출함. MUI에 문제를 보고할 경우 해당 패키지를 사용하여 전달하면 됨|
  |`./pakcages/mui-icons-material`|`false`|`Material Design icons를 SVG react components로 구현함`<br/> https://github.com/mui/material-ui/tree/master/packages/mui-icons-material|
  |./packages/mui-joy|true|MUI의 디자인 정책으로 구현된 오픈소스 리액트 컴포넌트 <br/> `@mui/base`를 이용해 스타일을 어떻게 적용하여 컴포넌트로 제공하는지 보기 좋은 듯 <br/> https://github.com/mui/material-ui/tree/master/packages/mui-joy|
  |`./packages/mui-lab`|`false`|`아직 코어로 가기 전의 실험 단계인 컴포넌트` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-lab|
  |`./packages/mui-material-nextjs`|`false`|`Next.js와 Material UI 공식 통합 패키지` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-material-nextjs|
  |`./pacakges/mui-material-pigment-css`|`false`|`@mui/system과 유사한 테마 및 스타일 지정 API를 제공하는 Pigment CSS에 대한 래퍼` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-material-pigment-css|
  |🔥🔥🔥 <br/> `./packages/mui-material`|`false`|`Google의 Material Design을 구현한 오픈소스 react component 라이브러리` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-material|
  |`./packages/mui-private-theming`|`false`|@mui/styles와 @mui/material간에 공유되는 react 테마 컨텍스트|
  |🔥🔥 <br/> `./packages/mui-system`|`false`|`맞춤형 디자인을 효율적으로 구축하도록 제공하는 CSS 유틸리티 세트` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-system|
  |`./packages/mui-styles-engine-sc`|`false`|@mui/styled-engine의 인터페이스를 구현하는 styled-comforts 패키지를 둘러싼 래퍼. @emotion/styled 대신 스타일 구성 요소를 기본 스타일 엔진으로 사용하려는 개발자를 위해 설계됨|
  |`./packages/mui-styled-engine`|`false`|@emotion/react 패키지를 둘러싼 래퍼. @mui/system 패키지에서 내부적으로 사용함 <br/> https://github.com/mui/material-ui/tree/master/packages/mui-styled-engine|
  |`./packages/mui-styles`|`false`|material ui 컴포넌트를 사용하지 않아도, 스타일링 솔루션을 사용할 수 있음|
  |🔥 <br/> `./packages/mui-system`|`false`|`커스텀 디자인을 구성하기 위한 CSS 유틸리티 세트` <br/> https://github.com/mui/material-ui/tree/master/packages/mui-system|
  |🔥 <br/> `./packages/mui-types`|`false`|MUI의 유틸리티 타입 <br/> https://github.com/mui/material-ui/tree/master/packages/mui-types|
  |🔥 <br/> `./packages/mui-utils`|`false`|MUI의 공통 유틸 <br/> https://github.com/mui/material-ui/tree/master/packages/mui-utils|

- mui-base, mui-material, mui-system 등 각 패키지에서 `react, react-dom, @types/react`를 각각 devDependencies, peerDependencies로 설치하였음
- typescript 는 각 패키지에 설치하지 않고 root에 devDepencencies로 설치하였으며, mui-base, mui-material, mui-system 등 각 패키지에서 include, exclude 등 개별 지정을 위해 tsconfig.json 을 생성함.
- root의 tsconfig.json에서 target, moduleResolution, paths 등을 설정하였으며, 각 패키지의 tsconfig.json에서 root의 tsconfig.json을 extends함

<br/>
<br/>
<br/>

## mui-material

### package.json

```
// npm publish 가능
"private": false,

// 별도 타입 지정하지 않음 -> type: "commonjs"

```

<br/>

```
"scripts": {
"build": "pnpm build:modern && pnpm build:node && pnpm build:stable && pnpm build:types && pnpm build:copy-files",
"build:modern": "node ../../scripts/build.mjs modern",
"build:node": "node ../../scripts/build.mjs node",
"build:stable": "node ../../scripts/build.mjs stable",
"build:copy-files": "node ../../scripts/copyFiles.mjs",
"build:types": "node ../../scripts/buildTypes.mjs",
"prebuild": "rimraf build tsconfig.build.tsbuildinfo",
"release": "pnpm build && pnpm publish",
"test": "cd ../../ && cross-env NODE_ENV=test mocha 'packages/mui-material/\*_/_.test.{js,ts,tsx}'",
"typescript": "tsc -p tsconfig.json",
"typescript:module-augmentation": "node scripts/testModuleAugmentation.js"
},

```

<br/>

https://github.com/mui/material-ui/blob/master/scripts/build.mjs
https://github.com/mui/material-ui/blob/master/scripts/buildTypes.mjs

<br/>

#### build.mjs

```
import childProcess from 'child_process'; // node - 하위 프로세스 생성
import glob from 'fast-glob';
import path from 'path';
import { promisify } from 'util';
import yargs from 'yargs';
import { getVersionEnvVariables, getWorkspaceRoot } from './utils.mjs';

const exec = promisify(childProcess.exec);

const validBundles = [
  // modern build with a rolling target using ES6 modules
  'modern',
  // build for node using commonJS modules
  'node',
  // build with a hardcoded target using ES6 modules
  'stable',
];

async function run(argv) {
  const { bundle, largeFiles, outDir: relativeOutDir, verbose } = argv;

  if (validBundles.indexOf(bundle) === -1) {
    throw new TypeError(
      `Unrecognized bundle '${bundle}'. Did you mean one of "${validBundles.join('", "')}"?`,
    );
  }

  const env = {
    NODE_ENV: 'production',
    BABEL_ENV: bundle,
    MUI_BUILD_VERBOSE: verbose,
    ...(await getVersionEnvVariables()),
  };

  const babelConfigPath = path.resolve(getWorkspaceRoot(), 'babel.config.js');
  const srcDir = path.resolve('./src');
  const extensions = ['.js', '.ts', '.tsx'];
  const ignore = [
    '**/*.test.js',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.d.ts',
  ];

  const topLevelNonIndexFiles = glob
    .sync(`*{${extensions.join(',')}}`, { cwd: srcDir, ignore })
    .filter((file) => {
      return path.basename(file, path.extname(file)) !== 'index';
    });
  const topLevelPathImportsCanBePackages = topLevelNonIndexFiles.length === 0;

  const outDir = path.resolve(
    relativeOutDir,
    // We generally support top level path imports e.g.
    // 1. `import ArrowDownIcon from '@mui/icons-material/ArrowDown'`.
    // 2. `import Typography from '@mui/material/Typography'`.
    // The first case resolves to a file while the second case resolves to a package first i.e. a package.json
    // This means that only in the second case the bundler can decide whether it uses ES modules or CommonJS modules.
    // Different extensions are not viable yet since they require additional bundler config for users and additional transpilation steps in our repo.
    //
    // TODO v6: Switch to `exports` field.
    {
      node: topLevelPathImportsCanBePackages ? './node' : './',
      modern: './modern',
      stable: topLevelPathImportsCanBePackages ? './' : './esm',
    }[bundle],
  );

  const babelArgs = [
    '--config-file',
    babelConfigPath,
    '--extensions',
    `"${extensions.join(',')}"`,
    srcDir,
    '--out-dir',
    outDir,
    '--ignore',
    // Need to put these patterns in quotes otherwise they might be evaluated by the used terminal.
    `"${ignore.join('","')}"`,
  ];
  if (largeFiles) {
    babelArgs.push('--compact false');
  }

  const command = ['pnpm babel', ...babelArgs].join(' ');

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(`running '${command}' with ${JSON.stringify(env)}`);
  }

  const { stderr, stdout } = await exec(command, { env: { ...process.env, ...env } });
  if (stderr) {
    throw new Error(`'${command}' failed with \n${stderr}`);
  }

  if (verbose) {
    // eslint-disable-next-line no-console
    console.log(stdout);
  }
}

yargs(process.argv.slice(2))
  .command({
    command: '$0 <bundle>',
    description: 'build package',
    builder: (command) => {
      return command
        .positional('bundle', {
          description: `Valid bundles: "${validBundles.join('" | "')}"`,
          type: 'string',
        })
        .option('largeFiles', {
          type: 'boolean',
          default: false,
          describe: 'Set to `true` if you know you are transpiling large files.',
        })
        .option('out-dir', { default: './build', type: 'string' })
        .option('verbose', { type: 'boolean' });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
```

<br/>
<br/>

### tsconfig.json

<br/>
<br/>

### src

<br/>
<br/>
```
