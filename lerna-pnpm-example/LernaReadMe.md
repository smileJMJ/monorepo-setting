# Lerna로 모노레포 셋팅하기

https://lerna.js.org/docs/introduction


<br/>
<br/>

# Why Lerna?
🔥 Super Fast! <br/>
Lerna is fast, even faster than most comparable solutions out there (see this benchmark to learn more). How? Under the hood, Lerna v6+ uses Nx to run tasks. Learn more about running tasks here. <br/>  
→ Lerna v6부터 Nx 에서 돌림. 빠름빠름 
🔥 Computation Caching <br/>
Lerna knows when the task you are about to run has been executed in the past. Instead of running it, Lerna will restore the files and replay the terminal output instantly. Plus, this cache can be shared with your co-workers and CI. When using Lerna, your whole organization will never have to build or test the same thing twice. <br/>
🔥 Configuration-Free Distributed Task Execution <br/>
Lerna can distribute any command across multiple machines without any configuration, while preserving the dev ergonomics of running it on a single machine. In other words, scaling your monorepo with Lerna is as simple as enabling a boolean flag. See the examples of how enabling DTE can make you CI 20 times faster. 
🔥 Beautiful Terminal Output <br/>
Monorepos can have hundreds or thousands of projects. Printing everything on every command makes it hard to see what fails and why. Thankfully, Lerna does a much better job.
🔥 Powerful Graph Visualizer Lerna comes with a powerful interactive visualizer simplifying the understanding of your workspaces. 
🔥 Publishing to NPM <br/>
Lerna is the ultimate tool for publishing multiple packages to npm. Whether the packages have independent versions or not, Lerna has you covered. 
🔥 Easy to Adopt Even with all these capabilities, Lerna is very easy to adopt. It requires close-to-zero configurations. Want to see how?

<br/>
<br/>

# pnpm으로 셋팅하기
https://lerna.js.org/docs/recipes/using-pnpm-with-lerna

(0) pnpm 설치 및 초기화하기
`npx pnpm init -y`   
※ pnpm 을 global로 설치해두지 않을 경우, 빌드 시 아래와 같은 에러가 발생할 수 있습니다. 
```
/bin/sh: pnpm: command not found
sh: pnpm: command not found 
```
→ `npm install -g pnpm` 으로 전역 설치하면 해결됩니다.   
(발생원인) lerna가 하위 패키지의 빌드를 실행할 때 pnpm을 사용하도록 설정되어 있는 경우 pnpm이 전역으로 설치되어 있어야 합니다.

(1) root 폴더의 node_modules 삭제하기

(2) lerna.json 추가하여 아래 코드 입력하기
```
{
  "npmClient": "pnpm",
  "version": "1.0.0"
}
```

(3) root 폴더에 pnpm-workspace.yaml 추가 후 아래 구문 추가하기
- yarn/npm의 package.json에 "workspaces" 속성이 있으면 제거하기 (lerna는 pnpm-workspace.yaml을 봄, yarn/npm 일 땐 package.json에 workspaces 속성 추가해야 함)

```
# pnpm-workspace.yaml

packages:
  - "packages/*"
```

(4) `pnpm install` 



(5) lerna init
- 빈 프로젝트에서 시작할 때: `npx lerna@latest init --dryRun` (--dryRun: lerna init 이 파일 시스템에 적용할 변경 사항을 미리 볼 수 있음)
- repo가 있을 때: `npx lerna@latest init --packages="packages/*"` 또는 `npx lerna@latest init --packages="foo/*" --packages="bar/*"`


🔥 Lerna 는 자동적으로 버전과 태그를 생성해주며, 패키지 레지스트리에 패키지 게시함


(6) Run
`npx lerna run build`
- root 에서 빌드 진행
- scope 가 없으므로 전체 패키지 전부 빌드됨

<br/>

`npx lerna run build --scope=header`
- root 에서 빌드 진행
- scope에 패키지명 추가하여 해당 패키지만 빌드됨

<br/>