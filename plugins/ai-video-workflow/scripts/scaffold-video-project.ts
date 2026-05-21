#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const targetArg = args.find((arg) => !arg.startsWith("--"));

if (!targetArg) {
  console.error("Usage: node plugins/ai-video-workflow/scripts/scaffold-video-project.ts <target-dir> [--title slug] [--profile name] [--format 16:9] [--duration 60]");
  process.exit(1);
}

const targetRoot = path.resolve(targetArg);
const title = valueFor("--title") ?? path.basename(targetRoot);
const profile = valueFor("--profile") ?? "<Voicebox profile name>";
const format = valueFor("--format") ?? "16:9";
const duration = valueFor("--duration") ?? "60";

function valueFor(flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

function writeIfMissing(relativePath: string, content: string): void {
  const fullPath = path.join(targetRoot, relativePath);
  if (existsSync(fullPath)) return;
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

mkdirSync(targetRoot, { recursive: true });
mkdirSync(path.join(targetRoot, "brief"), { recursive: true });
mkdirSync(path.join(targetRoot, "assets/audio"), { recursive: true });
mkdirSync(path.join(targetRoot, "assets/private/voice-samples"), { recursive: true });
mkdirSync(path.join(targetRoot, "outputs"), { recursive: true });

writeIfMissing(
  ".gitignore",
  [
    "# Local biometric and generated artifacts",
    "assets/private/",
    "outputs/",
    ".voicebox-cache/",
    "",
  ].join("\n"),
);

writeIfMissing(
  "README.md",
  `# ${title}\n\n이 프로젝트는 Voicebox 나레이션과 HyperFrames motion graphics 제작을 위한 작업 폴더다.\n\n## 다음 단계\n\n1. \`brief/narration.md\`에 최종 대본을 적는다.\n2. Voicebox profile \`${profile}\`로 10-20초 테스트 문장을 먼저 생성한다.\n3. 생성한 나레이션을 \`assets/audio/narration.wav\` 또는 선택한 안전한 위치에 둔다.\n4. \`brief/hyperframes-brief.md\`를 기준으로 HyperFrames project를 만들고 preview/render한다.\n5. 검증 명령을 실행한다.\n\n\`\`\`bash\nnode <skills-root>/plugins/ai-video-workflow/scripts/validate-video-project.ts .\n\`\`\`\n`,
);

writeIfMissing(
  "brief/narration.md",
  `# 나레이션 대본: ${title}\n\n## 제작 조건\n\n- Voicebox profile: \`${profile}\`\n- 언어: \`ko\`\n- 목표 길이: ${duration}초\n- 화면 비율: \`${format}\`\n- 사용 동의: 본인 목소리 또는 명시적 동의가 있는 목소리만 사용\n\n## 테스트 문장\n\n안녕하세요. 이 문장은 Voicebox 목소리 profile과 한국어 발음을 확인하기 위한 짧은 테스트입니다.\n\n## 최종 대본\n\n여기에 최종 나레이션 대본을 적는다.\n`,
);

writeIfMissing(
  "brief/voicebox-request.json",
  JSON.stringify(
    {
      text: "안녕하세요. 이 문장은 Voicebox 목소리 profile과 한국어 발음을 확인하기 위한 짧은 테스트입니다.",
      profile,
      language: "ko",
      notes: "Use only an owned or explicitly consented voice profile. Do not commit raw voice samples.",
    },
    null,
    2,
  ) + "\n",
);

writeIfMissing(
  "brief/hyperframes-brief.md",
  `# HyperFrames 제작 brief: ${title}\n\n## 영상 설정\n\n- 화면 비율: \`${format}\`\n- 목표 길이: ${duration}초\n- 나레이션 파일: \`assets/audio/narration.wav\`\n- 스타일: 정보형 motion graphics, 과장된 stock 느낌 없이 명확한 타이포그래피와 간결한 전환\n\n## 장면 계획\n\n| 시간 | 장면 | 화면 요소 | 나레이션 anchor |\n| --- | --- | --- | --- |\n| 0-5초 | Hook | 큰 질문, 짧은 sub caption | 첫 문장 |\n| 5-20초 | 문제 설명 | 핵심 개념 2-3개, 간단한 도식 | 문제 제기 |\n| 20-45초 | 본문 | 단계별 motion, 숫자 또는 비교 구조 | 핵심 설명 |\n| 45-${duration}초 | 정리 | 핵심 문장, 행동 유도 | 마무리 |\n\n## HyperFrames 명령\n\n\`\`\`bash\nnpx hyperframes init ${title}\ncd ${title}\nnpx hyperframes preview\nnpx hyperframes render\n\`\`\`\n`,
);

writeIfMissing("assets/audio/.gitkeep", "");
writeIfMissing("assets/private/voice-samples/.gitkeep", "");
writeIfMissing("outputs/.gitkeep", "");

console.log(`Created AI video workflow project at ${targetRoot}`);

