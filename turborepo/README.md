# Turborepo

https://turbo.build/repo/docs

- vercel에서 만든 JS와 TS 기반의 고성능 빌드 시스템
- monorepo 확장을 위해 설계되었으며, 단일 패키지 워크스페이스도 빠르게 만들어줌
- CI에서 동일한 일을 반복하지 않도록 '원격 캐시'에서 작업 결과물을 저장함
- 최대 속도로 작업을 예약하고, 이용 가능한 모든 코어에서 병렬화함

<br/>
<br/>

# Turborepo 셋팅하기

## (1) Turborepo 설치하기

```
npm install turbo --global / --save-dev
```

<br/>
<br/>

## (2) starter repository로 시작할 경우

```
npx create-turbo@latest
```

<br/>
<br/>

## (2) 또는 기존 폴더에서 셋팅할 경우

### (2-1) 프로젝트 구조 셋팅하기

(Structuring a repository) https://turbo.build/repo/docs/crafting-your-repository/structuring-a-repository

(Creating an Internal Package)
https://turbo.build/repo/docs/crafting-your-repository/creating-an-internal-package

```
// pnpm일 때
- pakage.json
- pnpm-lock.yaml
- turbo.json
- apps
  - projectA
    - package.json
  - projectB
    - package.json
- packages
  - ui
    - package.json
```

#### 📒 필수 구현 사항

- 패키지 매니저가 패키지 위치를 알 수 있도록 명시해야 함
- 패키지 매니저 lockfile
- root에 package.json 설정
- root에 turbo.json 설정
- 각각 package 내부에 package.json 설정

<br/>
<br/>

#### 📒 모노레포에서 패키지 구성하기

##### 1. 패키지 디렉토리 정하기

- package manager에 packages 위치 알려줘야 함
- 터보레포에선 app/packages로 나누어 앱/어플리케이션 서비스용, 패키지/라이브러리 및 기타 항목으로 분할하는 것을 추천하고 있음
- apps, packages 폴더 내의 디렉토리는 전부 패키지(워크스페이스)로 인지함
- apps/a/b, packages/c/d 등 중첩된 패키지 구조 셋팅 시 에러남.

```
// npm, yarn인 경우
// root/package.json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}

// pnpm인 경우
// root/pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"

```

<br/>
<br/>

##### 2. root에 package.json 셋팅

```
// root/package.json (기본적인 값들 명시함)
{
  "private": true, // 저장소에 publish 하지 않겠음 (실수 방지 차원)
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "pnpm@9.0.0"
}

```

<br/>
<br/>

##### 3. root에 turbo.json 셋팅

- turbo의 동작을 구성하기 위한 파일
- (Configuring turbo.json) https://turbo.build/repo/docs/reference/configuration

```
// example - basic의 turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env", ".env.*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}

```

- $schema
  - JSON 파일의 구조를 정의하고, 유효성을 검사할 수 있음
  - (ex) tsconfig.json / turbo.json 등에서 사용 가능
  - vscode와 같은 IDE에서 `$schema` 속성 인식하고, 해당 스키마에 따라 유효성 검사와 자동 완성 기능을 제공함
- tasks

```
// Dependency relations: ^이 붙은 경우
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
    },
  },
}

// Same package relationships: ^이 없는 경우
{
  "tasks": {
    "test": {
      "dependsOn": ["lint", "build"],
    },
  },
}

// Arbitrary task relatationships (임의의 작업 관계)
{
  "tasks": {
    "web#lint": {
      "dependsOn": ["utils#build"]
    }
  }
}

```

- key 값은 `turbo run`으로 실행할 수 있는 구문의 이름
- tasks.dependsOn: 작업을 실행하기 전에 완료되어야 할 작업 목록

  - Dependency relations: `작업명에 ^이 붙으면` 해당 작업이 먼저 완료될 때까지 기다려야한다는 것을 의미함. 특히 의존성 그래프는 제일 하위에서부터 상위로 의존성이 없을 때까지 올라오는데, "^build"의 경우 의존성 있는 하위 패키지들에서 build 작업을 완료할 때까지 root.package.json에서 지정한 build 작업을 기다려야 한다는 의미인듯(?!)
  - Same package relationships: `작업명에 ^이 없으면` 같은 패키지 내의 다른 작업을 완료할 때까지 기다렸다가 실행해야한다는 의미
  - Arbitrary task relatationships: `패키지명#작업명`이면 특정 패키지의 작업을 완료할 때까지 기다렸다가 실행해야한다는 의미

- inputs
  - 패키지가 변경되었는지 확인할 때 고려할 파일 glob 패키지 목록
  - inputs을 지정하면 기본 동작(default)이 해제되어 `$TURBO_DEFAULT$`을 추가하여 기본 동작도 수행할 수 있도록 해야 함
- outputs
  - tasks가 성공적으로 끝났을 때, 생성한 파일에 캐시를 적용할 경로  
    (ex) outputs: ["dist/**"]
    (빌드 후 생성한 파일 경로 중 dist 폴더 내 모든 파일은 캐싱 처리한다.)
- cache (default: true)
  - tasks 수행한 outputs 를 캐싱처리할 지 여부 지정
  - dev의 경우 outputs 파일을 생성하지 않을 땐 cache: false 처리하는 것이 좋음
- persistent (default: false)
  - 다른 작업이 장기 실행 프로세스에 의존하는 것을 방지함 (persistent: true)
  - dev server 실행 시 / watch 작업은 처럼 장기간 실행하는 작업들에 의존하는 작업이 있으면 turbo에서 에러 발생함

<br/>
<br/>

##### 4. package manager lockfile

- lockfile은 package manager와 turbo가 동작을 재현할 수 있는 파일임 (패키지 버전, 위치 등 전부 명시되어 있으므로)
- turbo는 lockfile을 통해 패키지간 의존성을 파악함

<br/>
<br/>

##### package.json에 필요한 속성들

- name
  - 워크스페이스별로 유니크해야 함
  - npm 레지스트리의 다른 패키지와 충돌을 방지하려면 내부 패키지에 네임스페이스 접두사를 사용하는 것이 가장 좋음 (ex) @{프로젝트명}/{package-name}
- scripts
  - turbo에서 패키지별 scripts에 지정한 작업명으로 식별함
- exports
  - 다른 패키지에서 해당 패키지를 사용하려할 때 진입점을 가져옴
  ```
  {
    "exports": {
      ".": "./dist/constants.ts",
      "./add": "./dist/add.ts"
    }
  }
  ```

<br/>
<br/>

🔥🔥 root에서 tsconfig.json을 지정하지 않고, 각 패키지별로 지정할 수 있도록 한다. (root 하위에 ts 파일이 있어 직접 ts를 구성해야하지 않는 이상)  
→ root를 변경하면 모든 작업에서 캐시가 누락될 수 있으므로 최대한 root에서 직접 변경되는 일 없게 패키지 단위로 나눠서 구성하는 것이 좋음 🔥🔥

- https://turbo.build/repo/docs/guides/tools/typescript#you-likely-dont-need-a-tsconfigjson-file-in-the-root-of-your-project
- https://turbo.build/repo/docs/crafting-your-repository/managing-dependencies#few-dependencies-in-the-root

<br/>
<br/>

### (3) 의존성 관리하기

#### package.json의 의존성 표기 차이

- 내부 패키지 사용 시와 외부 패키지 사용 시 package.json의 의존성 표기가 달라짐

```
{
  "dependencies": {
    "next": "latest", // External dependency
    "@repo/ui": "workspace:*" // Internal dependency
  }
}
```

<br/>
<br/>

#### 패키지 설치 방법

```
// root에서
pnpm install jest --save-dev --recursive --filter=web --filter=@repo/ui
```

- pnpm의 `--recursive` flag: install, publish 등과 함께 사용하면 작업 공간의 모든 프로젝트에서 명령을 실행함
  (https://pnpm.io/cli/recursive)
  🔥 root 에서 설치할 땐 --recursive 붙여야 에러가 나지 않음
- pnpm의 `--filter` flag: 특정 패키지만 적용하기 위한 플래그
- root에서 함께 설치하는 이유가 무엇일까??? 의존성 설치/관리를 root에서 진행하여 의존성 패키지별 버전 관리, 동일한 버전 사용 시 연결해줌 등등의 효율적인 의존성 관리를 위함이 아닐까??
  🔥 (ex) root에서 특정 패키지를 필터하여 react를 설치하면 root의 package.json에는 react가 설치되어 있지 않지만, pnpm-lock.yaml에는 react가 명시되어 있음(root에 설치하지 않고 하위 패키지에서 설치한거지만)
  - root의 pnpm-lock.yaml에 패키지별 의존성 명시가 되어있는데, 이렇게 되어야 의존성 그래프 그릴 수 있을 듯
    🔥 이 때, 종속성 관리는 Turborepo에서 하는게 아님!!! package manager가 수행하는 역할임!! (https://turbo.build/repo/docs/crafting-your-repository/managing-dependencies#turborepo-does-not-manage-dependencies)

<br/>

##### 패키지별 같은 버전의 의존성을 사용하고 싶을 때

- 패키지 관리자 기능을 사용할 수 있음

```
// npm
npm install typescript@latest --workspaces

// yarn1
yarn upgrade-interactive --latest

// yarn2
yarn upgrade typescript@latest --upgrade

// pnpm
pnpm up --recursive typescript@latest

```

<br/>
<br/>

# Turborepo CI/CD 셋팅하기

## CI

(1) scripts 구성 참고!!

📒 root의 package.json에서 각 패키지별 build script 추가함
https://github.com/nextui-org/nextui/blob/canary/package.json

```
"scripts": {
  "dev": "pnpm sb",
  "build": "turbo build --filter=!@nextui-org/docs --filter=!@nextui-org/storybook",
  "build:fast": "turbo build:fast --filter=!@nextui-org/docs --filter=!@nextui-org/storybook",
  "dev:docs": "turbo dev --filter=@nextui-org/docs",
  "build:docs": "turbo build --filter=@nextui-org/docs",
}
```
