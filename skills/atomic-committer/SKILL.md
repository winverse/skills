---
name: atomic-committer
description: "변경 파일을 secret guard로 검사하고 logical changeset별로 stage/commit한 뒤, 사용자가 push 금지를 명시하지 않는 한 remote와 branch를 확인해 push할 때 사용한다."
---

# 원자적 커밋

이 스킬은 dirty git tree를 의미 단위로 나누어 안전하게 commit/push한다. 핵심은 user change 보존, secret 차단, logical changeset 분리, 기본 push다.

## 핵심 계약

- 모든 변경을 한 번에 묶지 말고 logical changeset별로 commit한다.
- 사용자가 "commit", "커밋", "atomic commit"을 요청하면 기본적으로 commit + push 요청으로 해석한다.
- 사용자가 "push 하지 마", "commit only", "local only"처럼 push 금지를 명시한 경우에만 push를 생략한다.
- 여러 변경 단락이 있으면 logical changeset별로 commit을 분리하고, 커밋 묶음을 만든 뒤 현재 branch를 한 번 push한다.
- staging 전후에 candidate diff를 secret-bearing content 기준으로 검사한다.
- live-looking credential assignment나 private key material은 hard-block한다.
- 반복 생성되는 local artifact나 secret-bearing untracked file은 가장 좁은 `.gitignore` rule로 예방한다.
- 이미 tracked된 secret은 `.gitignore`로 우회하지 않는다.
- commit message는 English conventional prefix와 Korean summary 형식으로 쓴다.
- remote, branch, upstream이 확인되지 않으면 commit은 만들고 push 불가 사유를 final report에 남긴다.
- force-push, tag, release, deploy는 사용자가 별도로 명시하지 않는 한 하지 않는다.

## 메시지 형식

```text
<type>: <한글 요약>
<type>(<scope>): <한글 요약>
```

권장 type은 `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `ci`, `style`, `perf`, `revert`다.

## workflow

1. `git rev-parse --show-toplevel`로 worktree를 확인한다.
2. `git status --short`, `git diff --stat`, `git diff`, 필요하면 `git diff --cached`를 본다.
3. candidate diff와 untracked file을 forbidden content guard로 검사한다.
4. 변경 단락을 logical changeset으로 나누고 필요한 파일만 stage한다.
5. staged diff를 다시 검사한다.
6. 관련 validator/test를 실행한다.
7. changeset별로 commit한다.
8. 사용자가 push 금지를 명시하지 않았다면 remote/branch/upstream을 확인하고 push한다.

## forbidden content guard 기준

다음은 commit을 중단한다.

- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `AWS_SECRET_ACCESS_KEY`, `DATABASE_URL`, `MONGODB_URI` 같은 이름에 live-looking value가 할당된 줄
- `AKIA...`, `ASIA...` 형태의 AWS key
- `-----BEGIN PRIVATE KEY-----`, `-----BEGIN OPENSSH PRIVATE KEY-----` 같은 private key material
- username/password가 들어간 connection string

placeholder, example, dummy, fake, redacted value는 허용될 수 있지만 먼저 확인한다.

## final report 기준

- 생성한 commit hash와 message
- stage하지 않은 dirty file
- 실행한 validation
- push 실행 결과 또는 명시적 생략/불가 사유와 remote/branch
