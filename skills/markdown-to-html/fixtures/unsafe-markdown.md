# 안전하지 않은 Markdown fixture

이 fixture는 `markdown-to-html`이 실행 가능한 HTML이나 위험한 URL을 그대로 통과시키지 않는지 검증하기 위한 샘플이다.

<script>alert("xss")</script>

<img src="https://example.invalid/tracker.png" onerror="alert('xss')">

[위험한 링크](javascript:alert("xss"))

[VBScript 링크](vbscript:msgbox("xss"))

<iframe src="https://example.invalid/embed"></iframe>

<object data="https://example.invalid/object"></object>

<embed src="https://example.invalid/embed">

[허용 링크](https://example.com/docs)

[상대 링크](./SKILL.md)
