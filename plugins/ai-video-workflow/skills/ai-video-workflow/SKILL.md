---
name: ai-video-workflow
description: "대본이나 영상 아이디어를 사용자의 동의된 Voicebox 목소리 profile 또는 private voice sample과 HyperFrames HTML motion graphics 영상 제작 흐름으로 이어갈 때 사용한다."
---

# AI 영상 워크플로우

이 스킬은 로컬 Voicebox 음성 생성과 HyperFrames 영상 제작을 하나의 안전한 제작 루프로 묶는다. 목표는 대본을 나레이션으로 만들고, 그 나레이션을 기준으로 HTML motion graphics 영상 brief와 검증 가능한 산출물 구조를 만드는 것이다.

## 사용 판단

사용한다.

- 사용자가 본인 목소리 또는 동의된 목소리로 나레이션을 만들고 싶어 한다.
- 대본, 전사본, 교육 콘텐츠, 정보형 숏폼, 모션 그래픽 설명 영상을 만들고 싶어 한다.
- Voicebox, HyperFrames, 로컬 TTS, HTML video render, narration brief, caption sync, MP4 render가 함께 등장한다.
- Codex나 Claude가 설치, scaffold, brief 작성, render command, 검증 checklist를 도와야 한다.

건너뛴다.

- 타인의 목소리를 동의 없이 복제하려는 요청이다.
- 실사 cinematic video generation 자체가 목표다.
- 단순 영상 기획서만 필요하고 음성 생성이나 render handoff가 없다.
- 이미 완성된 영상의 일반 편집 리뷰만 필요하다. 이 경우 `design-review`, `browser-qa`, `code-review` 중 맞는 스킬을 쓴다.

## 핵심 원칙

- 목소리 샘플은 biometric artifact로 본다. shared repo에 넣지 않고 target project의 ignored private path나 Voicebox profile에만 둔다.
- Voicebox MCP/REST는 localhost라도 no-auth local trust boundary다. 사용 전 `Agent Tool And Security Risk Gate`를 짧게 남긴다.
- 본인 목소리거나 명시적 동의가 있는 목소리인지 확인하기 전에는 voice clone/profile 생성을 진행하지 않는다.
- 동의 없는 목소리 복제 금지는 이 workflow의 hard stop 기준이다.
- HyperFrames project는 HTML source, audio asset, caption/script, render output을 분리한다.
- 생성 음성의 품질은 한 번에 확정하지 않는다. 10-20초 샘플, 짧은 테스트 문장, 전체 나레이션 순서로 진행한다.
- 한국어 나레이션은 language/profile/engine 선택과 발음 검수를 별도 acceptance로 둔다.

## 작업 흐름

1. 입력을 정리한다.
   - 영상 목적, 대상 시청자, 길이, 화면 비율, 톤, 플랫폼, 대본 상태를 확인한다.
   - Voicebox profile name이 있는지, 아니면 본인 목소리 샘플을 새로 만들지 확인한다.
2. 안전 gate를 기록한다.
   - 목소리 소유자, 동의 범위, 공개 여부, private sample 저장 위치, 외부 업로드 여부를 적는다.
   - 타인의 목소리나 동의가 애매한 샘플이면 중단한다.
3. 환경을 확인한다.
   - `node plugins/ai-video-workflow/scripts/doctor.ts`를 실행한다.
   - 실제 Voicebox 생성까지 갈 때는 `--require-voicebox`를 붙인다.
4. 프로젝트를 만든다.
   - `node plugins/ai-video-workflow/scripts/scaffold-video-project.ts <target-dir> --title <slug> --profile <voice-profile>`를 실행한다.
   - 생성된 `brief/narration.md`, `brief/voicebox-request.json`, `brief/hyperframes-brief.md`를 채운다.
5. Voicebox lane을 진행한다.
   - 기존 profile이 있으면 profile name 또는 id를 쓴다.
   - profile이 없으면 Voicebox UI에서 본인 목소리 10-20초 샘플과 transcript로 profile을 만든 뒤 profile name만 기록한다.
   - 가능하면 MCP `voicebox.speak`를 쓰고, 아니면 `POST /speak` REST shape를 사용한다.
6. HyperFrames lane을 진행한다.
   - HyperFrames plugin/skills가 현재 runtime에 있으면 원본을 실제 호출한다.
   - 없으면 `npx hyperframes init`, `npx hyperframes preview`, `npx hyperframes render` 흐름으로 handoff한다.
   - `brief/hyperframes-brief.md`에는 scene timing, caption timing, audio path, aspect ratio, visual direction, render command를 적는다.
7. 검증한다.
   - `node plugins/ai-video-workflow/scripts/validate-video-project.ts <target-dir>`를 실행한다.
   - 실제 산출물이 있으면 `--expect-audio`, `--expect-video`, `--expect-html`로 audio, MP4, HTML source 존재를 확인한다.
   - 최종 보고에는 voice profile, source script, render command, 검수한 파일, 남은 리스크를 짧게 남긴다.

## 본인 목소리 샘플 사용 기준

본인 목소리를 샘플로 쓰는 방식은 좋다. Voicebox의 장점이 로컬 우선 voice cloning이기 때문에, 사용자가 직접 녹음한 짧은 샘플을 profile로 만들고 이후 그 profile name만 workflow에 넘기는 방식이 가장 자연스럽다.

다만 샘플 파일을 이 shared skills repo에 저장하지 않는다. target project에서도 기본은 `assets/private/voice-samples/`처럼 `.gitignore`된 경로에 둔다. 공개 repo에 필요한 것은 샘플 원본이 아니라 “어떤 profile을 썼고, 사용 권한이 확인됐고, 어떤 대본을 생성했는지”라는 제작 기록이다.

## 파일과 명령

- Plugin manifest: `plugins/ai-video-workflow/.codex-plugin/plugin.json`
- Skill source: `plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md`
- Human guide: `plugins/ai-video-workflow/skills/ai-video-workflow/skill.html`
- Source ledger: `plugins/ai-video-workflow/skills/ai-video-workflow/references/source-ledger.md`
- Doctor: `node plugins/ai-video-workflow/scripts/doctor.ts`
- Scaffold: `node plugins/ai-video-workflow/scripts/scaffold-video-project.ts <target-dir>`
- Validation: `node plugins/ai-video-workflow/scripts/validate-video-project.ts <target-dir>`
