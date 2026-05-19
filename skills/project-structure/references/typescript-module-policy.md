# TypeScript module 정책

## 기본 원칙

`project-structure`가 TypeScript 프로젝트 구조를 제안하거나 표준화할 때는 ESM만 사용한다. `CommonJS`는 새 구조의 선택지가 아니며, 기존 프로젝트에 남아 있으면 전환 대상으로 표시한다.

## package 기준

- `package.json`에는 `type: "module"`을 둔다.
- source code는 `import`/`export` 문법만 사용한다.
- `require`, `module.exports`, `exports.*`를 새 파일에 만들지 않는다.
- `.cjs`, `.cts` 파일을 만들거나 권장하지 않는다.
- 기존 CommonJS 파일이 있으면 삭제나 즉시 변환이 위험한지 확인하고, ESM migration boundary로 분리한다.

## tsconfig 기준

Node/NestJS runtime은 아래 설정을 우선한다.

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

Bun, Next.js, browser-bundled runtime은 아래 설정을 우선한다.

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler"
  }
}
```

## 도구 설정 기준

repo-owned tool config도 ESM으로 둔다. 외부 도구가 CommonJS 설정만 요구하는 것처럼 보이면 `.cjs` fallback을 추가하지 말고 ESM 지원 경로를 찾거나 사용자에게 예외 승인을 요청한다.

## 최종 tree에 표시할 것

- `package.json`의 `type: "module"`
- runtime별 `tsconfig` module과 moduleResolution
- CommonJS 잔존 파일이 있으면 ESM migration boundary
- `require`/`module.exports` 금지
