# react component library 만들기

- react를 이용한 component, constant, hooks 등 공통 컴포넌트, 유틸 라이브러리 개발하고 싶음
- material-ui처럼 사용처에서 컴포넌트/유틸 등을 각각 import 해서 사용할 수 있도록 개별 빌드 필요  
  (ex) `import Box from 'react-common-preset/components/box/Box.js'`
- typescript로 개발 및 .d.ts 파일도 함께 제공해야 함
- 번들러는 esbuild 사용
- `type: module`로 개발하고, 사용처의 type(esm, cjs)에 관계 없이 다 사용 가능하도록 제공 필요.

<br/>
<br/>

## 구조

```
// 소스코드
- src
  - components
  - constants
  - utils

// 빌드 결과물
- dist
  - js (혹은 해당 폴더 없음)
    - components
      - box
        - Box.js
        - Box.d.ts
    - constants
    - utils
```

<br/>
<br/>

## 작업하면서 확인한 내용들

### (1) js 코드 빌드 + 타입 정의 파일 생성하기

##### 1. esbuild 사용하여 js로 빌드하기 + `tsc`(`noEmit: false, emitDeclarationOnly: true`)로 타입 정의 파일만 생성하기

###### tsconfig.json

```
{
  "extends": "config-typescript/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist/js",
    "jsx": "react-jsx",
    "typeRoots": ["./node_modules/@types", "./src/js/types"],
    "baseUrl": "./src",
    "noEmit": false,
    "emitDeclarationOnly": true,
    "paths": {
      "@components/*": ["js/components/*"],
      "@constants/*": ["js/constants/*"],
      "@types/*": ["js/types/*"],
      "@utils/*": ["js/utils/*"]
    }
  },
  "include": ["src", "src/js/types/global.d.ts"]
}
```

<br/>

###### esbuild.config.js

```
runBuild(
  {
    entryPoints: ['./src/**/'], // src 내 모든 폴더들을 entryPoints로 지정하여 폴더별 js 빌드 파일이 생성됨
    format: 'esm',

    // 1. 번들링을 사용하되, react, react-dom, tanstack query 등 사용처에도 설치해서 사용하는 패키지들은 번들링 제외함
    bundle: true, // axios 등 설치형 패키지 코드들도 함께 번들링 됨
    external: ['react', 'react-dom', '@tanstack/react-query']

    // 2. 번들링 사용하지 않음
    bundle: false
    ...
  }
);
```

- `entryPoints: ['./src/**/']` 설정
  - https://esbuild.github.io/api/#glob-style-entry-points
  - src 내의 모든 폴더 파일들을 entryPoints 로 설정함
- `format: 'esm'` 설정
  - `type: module`로 설정 후 esm 형태로 작성한 코드의 경우, esbuild에서 'esm'으로 빌드하도록 format 지정이 필요함
  - format 지정해주지 않을 시 아래와 같은 에러가 생겼음
  ```
  No matching export in "node_modules/패키지명/dist/폴더명/index.js" for import "default"
  ```
  - https://esbuild.github.io/api/#format
- react, react-dom 등 사용처에서도 설치하여 사용 중인 패키지들을 번들링하여 라이브러리에서 갖고 있는게 맞는지 의문이 듬 <br/>

* `tanstack query`의 경우 라이브러리에서 번들링하여 사용처에서 사용하면 해당 코드를 인식하지 못하는 이슈 발생함 (tanstack query를 번들하지 않고, 사용처의 코드를 사용할 경우엔 이슈 없음) <br/>
  - https://esbuild.github.io/api/#external

```
bundle: true,
external: [],
// 을 사용하거나

bundle: false
// 로 전체 bundle 기능을 사용하지 않거나..?
```

<br/>
<br/>

###### package.json

```
"exports": {
  "./components/*": "./dist/js/components/*",
  "./constants/*": "./dist/js/constants/*",
  "./utils/*": "./dist/js/utils/*"
},
"peerDependencies": {
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "@tanstack/react-query": "^5.45.1"
}
```

- esbuild.config.js에서 `bundle: false` 또는 `external: []` 지정 시, 라이브러리 사용에 꼭 필요한(import 구문으로 호출한 모듈 등) 패키지들은 `peerDependencies`를 명시한다.
- (exports) https://webpack.kr/guides/package-exports/

<br/>
<br/>

##### 2. `tsc`로 js 빌드 및 타입 정의 파일 생성하기(`noEmit: false, emitDeclarationOnly: false`) 로 빌드하기

###### tsconfig.json

```
{
  "extends": "config-typescript/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist/js",
    "jsx": "react-jsx",
    "typeRoots": ["./node_modules/@types", "./src/js/types"],
    "baseUrl": "./src",
    "noEmit": false,
    "emitDeclarationOnly": false,
    "allowImportingTsExtensions": false,
    "paths": {
      "@components/*": ["js/components/*"],
      "@constants/*": ["js/constants/*"],
      "@types/*": ["js/types/*"],
      "@utils/*": ["js/utils/*"]
    }
  },
  "include": ["src", "src/js/types/global.d.ts"]
}
```

<br/>

###### package.json

```
"exports": {
   "./components/*": "./dist/js/components/*",
   "./constants/*": "./dist/js/constants/*",
   "./utils/*": "./dist/js/utils/*"
  },
```

<br/>

- 위의 설정으로 `tsc` 실행 시, dist/js 폴더에 각 폴더 별 js 파일과 .d.ts 파일이 생성됨
- 단, js로 변환은 되나 번들링이 되지 않음 (ex. `import axios from 'axios'` 의 axios 코드는 번들되지 않고 import 구문 그대로 유지됨 )

<br/>
<br/>

#### 결론

- 번들링이 가능하고 minify 등 다양한 옵션을 사용할 수 있도록 번들러를 통한 js 빌드를 사용하는 것이 좋겠다.

<br/>
<br/>

### react - forwardRef 사용해야 하는가??

- https://ko.react.dev/reference/react/forwardRef
- 외부/부모 컴포넌트에서 생성한 ref 값을 자식 컴포넌트/라이브러리 컴포넌트 등에 전달하여 사용할 수 있음
- 자식 컴포넌트 dom에 focus 동작을 실행하는 등의 dom 조작, 필수적인 ref 값 사용해야하는 경우를 제외하곤 되도록이면 Props 로 사용하는 것이 좋음
- material-ui에서 각 컴포넌트 별로 forwardRef()를 감싸고 있는데, 외부에서 해당 컴포넌트에 ref를 참조해서 사용할 수 있도록 열어준 듯.
- 기왕이면 컴포넌트 라이브러리들은 forwardRef 로 감싸서 내보내는게 좋을듯!!!!!
