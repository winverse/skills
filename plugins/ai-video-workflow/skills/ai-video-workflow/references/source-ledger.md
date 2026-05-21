# AI 영상 워크플로우 출처 장부

Source URL과 checked date는 `docs/update-source-registry.md`의 external tool lane을 정본으로 본다.

## Source ledger

| Source ID | 확인 내용 | Local 판단 |
| --- | --- | --- |
| `observed.voicebox` | Voicebox는 local-first AI voice studio이며 voice cloning, speech generation, dictation, REST API, built-in MCP server를 제공한다. | `adapt`: 이 plugin은 Voicebox를 vendored submodule로 넣지 않고 localhost profile/API workflow로 연결한다. |
| `observed.voicebox-mcp` | Voicebox MCP는 `http://127.0.0.1:17493/mcp`에서 Streamable HTTP로 동작하고 `voicebox.speak`, `voicebox.transcribe`, `voicebox.list_profiles` 같은 tool을 제공한다. Security section은 localhost/no-auth trust boundary와 voice cloning consent를 명시한다. | `adapt`: 자동 MCP 등록은 하지 않고, 사용자가 필요할 때 target agent config에 추가한다. |
| `observed.hyperframes` | HyperFrames는 HTML 기반 video composition을 preview/render하는 open-source framework이며 agent skills와 Codex plugin surface를 제공한다. Node.js 22 이상과 FFmpeg가 필요하다. | `adapt`: 이 plugin은 HyperFrames 자체를 복제하지 않고 narration-to-brief handoff와 validation scaffold만 제공한다. |

## 선택 MCP snippet

Voicebox desktop app이 켜져 있고 agent에서 MCP 연결을 직접 쓰고 싶을 때만 target project나 user config에 추가한다. 이 shared repo plugin manifest에는 넣지 않는다.

```json
{
  "mcpServers": {
    "voicebox": {
      "url": "http://127.0.0.1:17493/mcp",
      "headers": {
        "X-Voicebox-Client-Id": "codex-ai-video-workflow"
      }
    }
  }
}
```

## REST fallback shape

MCP client가 없고 Voicebox app이 실행 중이면 REST 호출로 짧은 테스트를 할 수 있다.

```bash
curl -X POST http://127.0.0.1:17493/speak \
  -H 'Content-Type: application/json' \
  -H 'X-Voicebox-Client-Id: codex-ai-video-workflow' \
  -d '{"text":"테스트 나레이션입니다.","profile":"My Voice","language":"ko"}'
```

Voicebox 문서상 profile resolution은 passed name/id, client binding, default voice 순서다. 이 workflow에서는 silent fallback을 피하기 위해 profile name을 명시하는 쪽을 기본으로 둔다.
