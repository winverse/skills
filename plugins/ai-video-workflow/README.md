# ai-video-workflow plugin

`ai-video-workflow`는 repo-owned plugin이다. 대본이나 영상 아이디어를 Voicebox 로컬 음성 생성과 HyperFrames HTML motion graphics 제작 흐름으로 이어준다.

## 포함 범위

| Plugin skill | 역할 |
| --- | --- |
| `ai-video-workflow` | 동의된 목소리 샘플 또는 기존 Voicebox profile을 기준으로 나레이션 brief, Voicebox 생성 요청, HyperFrames 제작 brief, 산출물 검증을 묶는다. |

## 선택 실행 도구

```bash
node plugins/ai-video-workflow/scripts/doctor.ts
node plugins/ai-video-workflow/scripts/scaffold-video-project.ts /path/to/video-project --title "sleep-cycle-short" --profile "My Voice"
node plugins/ai-video-workflow/scripts/validate-video-project.ts /path/to/video-project
```

`doctor.ts`는 Node 22, `ffmpeg`, `npx`, Voicebox localhost port 상태를 확인한다. Voicebox가 꺼져 있어도 scaffold 자체는 가능하므로 기본은 경고로만 다루고, 실제 생성 직전에는 `--require-voicebox`를 붙여 실패하게 한다.

`scaffold-video-project.ts`는 target project에 `brief/`, `assets/audio/`, `assets/private/voice-samples/`, `outputs/` 기본 구조와 `.gitignore`를 만든다. 실제 목소리 샘플은 `assets/private/voice-samples/`처럼 commit되지 않는 위치에 두거나 Voicebox profile로만 관리한다.

`validate-video-project.ts`는 scaffold 파일, private sample ignore, 선택적 audio/video/html 산출물 존재 여부를 검사한다.

## Voicebox MCP 경계

Voicebox MCP는 Voicebox desktop app이 실행 중일 때만 `http://127.0.0.1:17493/mcp`로 연결된다. 이 plugin은 MCP config를 자동 등록하지 않는다. Voicebox가 꺼진 환경에서 Codex 시작 경고가 반복될 수 있기 때문이다.

필요하면 `skills/ai-video-workflow/references/source-ledger.md`의 MCP snippet을 target project나 agent config에 직접 복사한다.

## 개인 목소리 샘플 기준

본인 목소리 샘플을 쓰는 방식은 이 workflow에 잘 맞는다. 다만 샘플 파일 자체는 민감한 biometric artifact로 보고 shared repo에 넣지 않는다.

- 본인 목소리 또는 명시적 동의가 있는 목소리만 사용한다.
- 샘플 파일은 target project의 ignored private path나 Voicebox profile 내부에만 둔다.
- 생성된 나레이션이 실제 공개 영상에 들어가면 script, profile name, 생성 도구, 검수 결과를 기록한다.
- 타인의 목소리, 고객 음성, 회의 녹음, 강의 음성은 동의와 사용 범위가 없으면 사용하지 않는다.

## 정본 경로

```text
plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md
```

