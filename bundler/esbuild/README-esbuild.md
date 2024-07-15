# esbuild 끄적끄적

## esbuild란?

```
매우 빠른 번들러!
https://esbuild.github.io/
```

<br/>

#### build

https://esbuild.github.io/api/#build

- esbuild는 번들러이므로, build는 모듈로 구성된 파일을 하나/여러개의 파일로 묶어주는 작업 진행 (transfile, minify 등등 함께 하겠지만!)
- 주어진 컨텍스트에서 수행되는 모든 빌드는 동일한 빌드 옵션을 공유하며 이후의 빌드는 점진적으로 수행됨
- incremental build 사용함!!

  ```
  ※ incremental build???
    - SW개발에서 이전에 컴파일 된 결과는 재사용해서 빌드 시간을 단축하는 방식
    - 처음부터 다시 빌드하는 대신, 변경된 부분만 빌드함
      → 빌드 시간, 리소스 절약됨
  ```

- esbuild의 incremental build API
  - Watch mode: 파일 시스템을 감시하며 파일 편집/저장 시 자동으로 재빌드 함
  - Serve mode: 최신 빌드 결과를 로컬 개발 서버에 서비스하며, 요청이 오면 자동적으로 새로 빌드함
  - Rebuild mode: 수동으로 빌드함. esbuild 내장 watch, serve 가 아닌 다른 툴 이용 시 유용함

```
const { watch, serve, rebuild } = await esbuild.context({
  entryPoints: ['app.ts'],
  bundle: true,
  outdir: 'dist',
});
```

- 해당 모드들 함께 사용 가능 (ex) liveReload - serve + watch

<br/>
<br/>

#### Transform

<br/>
<br/>

## 🔥 이슈?!! 🔥

| option명   | dev(context)       | build              |
| ---------- | ------------------ | ------------------ |
| assetNames | `[dir]/[name]`     | `[dir]/[name]`     |
| publicPath | x                  | x                  |
| outbase    | x                  | x                  |
| loader     | `{'.jpg': 'file'}` | `{'.jpg': 'file'}` |

- (공통)
  - assets 생성 시 `dist/_.._/assets/...` 로 생성되며, 코드 내에서 경로도 `/_.._/assets`로 되어 있음
- (dev)
  - js에서 `import TestImg from '@src/assets/img/test.jpg';` 이미지 미노출됨.
  - css에서 `background-image: url('../../../assets/img/test.jpg');` 이미지 노출됨.
- (build)
  - js에서 이미지 경로는 `/_.._/assets/...`로 되어 있으나 정상 노출됨
  - css에서 이미지 경로는 `/_.._/assets/...`로 되어 있으나 정상 노출됨

<br/>

📒 (추측) loader와 path 관련 옵션으로 인해 발생한 현상으로 추측되나, 이해하고 있는 내용이 명확하지 않아 다시 찬찬히 보려고 함!!!

- loader
- assetNames
- publicPath
- outbase

<br/>
<br/>

## loader

<br/>
<br/>

## Content Types

### CSS

- css loader는 파일을 CSS 구문으로 로드함
- loader: css (일반 스타일 파일 로더), global-css / local-css (css module 로더)
- .css 파일은 css loader가 기본적으로 활성화되며, .module.css 파일은 local-css 로더가 활성화 됨
- esbuild에서 css 파일을 entry에 직접 연결하여 번들할 수 있음
- js에서 css import 할 경우, css 진입점에서 css 파일들을 가져와 번들하며 js 옆에 해당 js 명으로 번들됨. (ex) app.js에서 호출한 경우 → app.css

#### Sass 사용 시 셋팅해야 할 것

```
// 폴더 구조
- src
  - js
    - component
      - test
        - Test.tsx
        - Test.module.scss
  - sass
    - utils
      - mixin
        - _hidden.scss
        - ...
      - _reset.scss
      - _variable.scss
      - _mixin.scss
    - index.scss

// sass 셋팅 목표
(1) module.scss, src/sass/*.scss → css로 번들링 및 변환
(2) module.scss에서 variable.scss, mixin.scss 코드 사용 가능함
```

<br/>
<br/>

##### (1) module.scss, src/sass/\*.scss → css로 번들링 및 변환

```
// esbuild.config.js

{
  ...
  plugins: [
    // sass module - .scss보다 먼저 선언되어야 함
    sassPlugin({
      filter: /\.module\.scss$/,
      type: 'local-css',
    }),

    // sass
    sassPlugin({
      filter: /\.scss$/,
      cssImports: true,
      type: 'css',
    }),
  ],
}
```

<br/>
<br/>

##### (2) module.scss에서 variable.scss, mixin.scss 코드 사용 가능함

```
// esbuild.config.js

{
  ...
  plugins: [
    // sass module - .scss보다 먼저 선언되어야 함
    sassPlugin({
      filter: /\.module\.scss$/,
      type: 'local-css',
      precompile(source, pathname, isRoot) {
        /*
          - module.css에서도 mixin, variable 사용할 수 있도록
          - precompile에 추가하지 않을 경우 각 module.css에서 @use 구문 추가 후 사용해야 함
        */
        return isRoot
          ? `@use '../../../sass/utils/_variable.scss' as *;\n@use '../../../sass/utils/_mixin.scss' as *;\n${source}`
          : source;
      },
    }),

    // sass
    sassPlugin({
      filter: /\.scss$/,
      cssImports: true,
      type: 'css',
    }),
  ],
}
```

<br/>
<br/>
