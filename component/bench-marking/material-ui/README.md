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

## ./packages/mui-material

### ./packages/mui-material/package.json

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
<br/>

### 빌드 후 생성되는 ./packages/mui-material/build/package.json 과 비교

| 항목(package.[key]) | `./package.json` | `./build/package.json` |
| ------------------- | ---------------- | ---------------------- |
| main                | `./src/index.ts` | `./node/index.js`      |
| scripts             | 있음             | 없음                   |
| devDependencies     | 있음             | 없음                   |
| module              | 없음             | `./index.js`           |
| types               | 없음             | `./index.d.ts`         |

🔥 module, types 을 `exports`로 사용할 수 있음

<br/>
<br/>

### tsconfig.json

<br/>
<br/>

### src

#### 특징

- 각 컴포넌트 폴더마다 아래의 파일 셋트를 가지고 있음

```
// src/Accordion
- Accordion.d.ts
- Accordion.js
- Accordion.spec.tsx
- Accordion.test.js
- accordionClasses.ts
- AccordionContext.js
- index.d.ts
- index.js

// src/Alert
- Alert.d.ts
- Alert.js
- Alert.spec.tsx
- Alert.test.js
- alertClasses.ts
- index.d.ts
- index.js
```

- `{컴포넌트명}.d.ts`: 컴포넌트의 props, state 등 실제 컴포넌트 구현, 사용에 필요한 타입을 정의한 파일
- `{컴포넌트명}.js`: 컴포넌트 코드
  - 컴포넌트는 React.forwardRef()로 생성한 실제 react 컴포넌트 코드
  - 컴포넌트 코드 하위에 `{컴포넌트}.prototype` 코드는 `pnpm proptypes`를 실행하여 `{컴포넌트}.d.ts`에서 참조한 타입 값을 복붙함
- `{컴포넌트명}.spec.tsx`: 컴포넌트를 .tsx에서 사용한 테스트 케이스로 보임
- `{컴포넌트명}.test.js`: chai 테스트 코드
- `{컴포넌트명}Classes.ts`: `{컴포넌트명}.js`에서 정의한
- `index.d.ts`: 컴포넌트 타입 정의 파일과 (`{컴포넌트명}.d.ts`)와 클래스(`{컴포넌트명}Classes.ts`) 타입을 정의한/export한 파일
- `index.js`: 컴포넌트를 export한 파일

<br/>

🔥 참고할 부분

- ✎ 왜 타입들을 d.ts로 별도로 작성하면서 컴포넌트는 js로 개발했을까??  
  (추측) material-ui 초기 개발 당시엔 typescript 사용이 미미하여, 또는 내부 이유로 js 로 개발하였지만 점차 ts 사용처들이 많아져 타입 정의 파일을 제공하게 된 게 아닐까?
  (추측2) 해당 git에는 tsc emit 한 파일만 올려둔 것인가..?! 는 아닌듯..!
- ✎ build 파일에 컴포넌트 빌드 파일(js)과 타입 정의 파일(d.ts)를 제공해야 할 듯
- ✎ @mui/material은 commonjs이지만, esm으로 작업되어 있음(import, export)
  → type: module로 개발하면 commonjs 대응은 .cjs, .cts 로 제공해줘도 될 듯!
- (궁금증)
  - (1) @mui/material은 `commonjs(type: 'commonjs')` 인데, index.js에선 export 하는 `esm` 구조로 정의함??
  - (2) accordionClasses 는 정확한 역할이 무엇이길래 index.js/index.d.ts 에서 export 하고 있는가???
  - (3) Accordion 컴포넌트를 사용하는 곳에서 확인했을 때 아래와 같은 구조를 가짐
    -> index.js 에서 export 한 코드들은 어떻게 아래의 코드 형태가 되었는가?
  ```
  ==accordion==
  {render: ƒ Accordion(), propTypes: Object}
  ```
  - Accordion은 child에 AccordionSummary, AccordionDetails 등 하위 컴포넌트들을 주입해서 사용할 수 있음. 어떻게 구현 가능한지 확인 필요함!!
    https://codesandbox.io/s/quizzical-breeze-k7ksst?file=/src/Demo.tsx
  - build의 각 컴포넌트별 폴더에 package.json이 위치함. root의 package.json과 컴포넌트 별 package.json이 함께 merge되는 것인지 확인 필요!!!
    (그렇다면, material ui 처럼 컴포넌트가 많은 경우 root의 package.json에 export 구문을 나열하지 않아도 되므로 좋을듯?)

<br/>
<br/>

#### export

<br/>
<br/>

#### build

```
🌈 package.json - build script

"build": "pnpm build:modern && pnpm build:node && pnpm build:stable && pnpm build:types && pnpm build:copy-files",
```

<br/>

```
🌈 npx pnpm run build --scope=@mui/material 실행 시

> @mui/material:build


> @mui/material@6.0.2 prebuild {저장 경로}/material-ui/packages/mui-material
> rimraf build tsconfig.build.tsbuildinfo


> @mui/material@6.0.2 build {저장 경로}/material-ui/packages/mui-material
> pnpm build:modern && pnpm build:node && pnpm build:stable && pnpm build:types && pnpm build:copy-files


> @mui/material@6.0.2 build:modern {저장 경로}/material-ui/packages/mui-material
> node ../../scripts/build.mjs modern


> @mui/material@6.0.2 build:node {저장 경로}/material-ui/packages/mui-material
> node ../../scripts/build.mjs node


> @mui/material@6.0.2 build:stable {저장 경로}/material-ui/packages/mui-material
> node ../../scripts/build.mjs stable


> @mui/material@6.0.2 build:types {저장 경로}/material-ui/packages/mui-material
> node ../../scripts/buildTypes.mjs

OK '{저장 경로}/material-ui/packages/mui-material/build/AccordionActions/accordionActionsClasses.d.ts'
OK '{저장 경로}/material-ui/packages/mui-material/build/AccordionDetails/accordionDetailsClasses.d.ts'
OK '{저장 경로}/material-ui/packages/mui-material/build/Accordion/accordionClasses.d.ts'
....

Fixed: 0
Failed: 0
Total: 206

> @mui/material@6.0.2 build:copy-files {저장 경로}/material-ui/packages/mui-material
> node ../../scripts/copyFiles.mjs

Created package.json in {저장 경로}/material-ui/packages/mui-material/build/package.json
Copied {저장 경로}/material-ui/packages/mui-material/README.md to {저장 경로}/material-ui/packages/mui-material/build/README.md
Copied {저장 경로}/material-ui/LICENSE to {저장 경로}/material-ui/packages/mui-material/build/LICENSE
Copied {저장 경로}/material-ui/CHANGELOG.md to {저장 경로}/material-ui/packages/mui-material/build/CHANGELOG.md

———————————————————————————————————————————————————————————————————

 Lerna (powered by Nx)   Successfully ran target build for project @mui/material and 8 tasks it depends on

```

##### build 전후 컴포넌트 파일 변화 (npx pnpm run build --scope=@mui/material)

```
// build 전 Accordion 폴더 (src/Accordion)
- Accordion.d.ts
- Accordion.js
- Accordion.spec.tsx
- Accordion.test.js
- accordionClasses.ts
- AccordionContext.js
- index.d.ts
- index.js
```

<br/>

```
// build 후 Accordion 폴더 (build/Accordion)
- Accordion.d.ts (동일)
- Accordion.js (transpile)
- accordionClasses.d.ts 🧸 (AccordionClass 타입 정의)
- accordionClasses.js 🧸 (accordionClasses.ts에서 타입 정의 제거한 순수 js코드만 있는 파일)
- AccordionContext.js (동일)
- index.d.ts (동일)
- index.js (import 구문에서 .js 확장자 붙음)
- package.json 🧸
```

<br/>
<br/>
```
