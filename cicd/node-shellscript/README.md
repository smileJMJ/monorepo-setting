# node로 shell script 작성하기

# 🔥 현재 이슈 🔥

(1) ※ 두 패키지 버전은 0.0.1-dev 유지한 상태로 코드만 변경하였으나,

- 사내 레포로 publish 안됨
- CD 트리거는 발생함

publish 에러나면서 빌드 에러 나야하는데 CI 서버에서 에러 발생하지 않고, CD 서버도 실행됨..!!!

https://spinnaker.io/docs/guides/user/pipeline/triggers/jenkins/

spinnaker - Trigger 타입 중 jenkins는 해당 jenkins 빌드가 성공적으로 완료되면 트리거 발생함
(추측) pnpm --recursive 통해 하위패키지 모두 실행하면서 에러를 반환하지 않은게 아닌가..
(고민) publish 되지 않으면 빌드 에러를 발생시켜서 CI 서버를 멈추게 해야하나?!

<br/>

(2) pnpm --filter "...[origin/master]" 를 build, publish 에 추가하여 CI 진행하였으나, 변경이 일어난 stamp 만 실행되지 않고, 다른 패키지들도 build, publish 진행함

오히려, package scope에 ‘//’가 포함되어 있어 해당 필터 제거함..

(추측) pnpm에서 변경된 패키지만 filter 되는지 확인이 어렵고.. build는 turbo run build로 실행되니 하위 build 스크립트가 있는 패키지 전부 실행될테니 소용이 없는 듯…

https://pnpm.io/ko/next/filtering#--filter-since

=> 여러 패키지 중 하나만 publish 실패했을 때 전체 에러를 반환하는게 맞는 것인가..?? publish 성공한 패키지는 CD 진행되도록 트리거 발생시키면 좋을텐데?!
=> build task 코드를 쉘 스크립트 대신 nodejs 로 구성해서 패키지 for문 돌려 error / 예외 처리 할 수 있도록, 젠킨스 build tasks에는 root의 pnpm run ci(가칭) 실행(node ./buildtask.js) 로 해볼까..!!

<br/>
<br/>

# 목표

- 특정 패키지가 publish 되지 않았다고 전체 모노레포 빌드를 실패로 표기하는 것은 아니라고 생각함
- publish 되지 않은 패키지는 CD 서버가 실행되지 않고, 정상적으로 publish 된 패키지만 CD 서버 실행시키고 싶음..!!

<br/>
<br/>

# 방법

(1) nodejs를 shell script 처럼 실행하는 법

- child_proccess Module의 exec() / spawn()
  - child_process 모듈은 하위 프로세스를 생성하는 기능을 제공함
  - child_process.spawn(): Node.js 이벤트 루프를 차단하지 않고 자식 프로세스를 비동기적으로 생성함(참고. NodeJS는 단일 프로세스라 하지만, 비동기로 자식 프로세스를 생성하고 실행 결과 값/에러를 단일 프로세스에 반환한다고 함)
  - child_process.spawnSync(): 생성된 프로세스가 종료되거나 종료될 때까지 이벤트 루프를 차단하는 동기식 방식으로 기능을 제공함
  - child_process.exec(): 쉘을 생성하고 해당 쉘 내에서 명령을 실행하여 완료되면 stdout 및 stderr를 콜백 함수에 전달함
  - https://nodejs.org/api/child_process.html
- shellJS
  - https://www.npmjs.com/package/shelljs

<br/>
<br/>
