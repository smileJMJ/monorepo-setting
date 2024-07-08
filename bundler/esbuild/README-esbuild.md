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
