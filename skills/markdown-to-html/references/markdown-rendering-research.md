# Markdown 렌더링 조사 메모

2026-05-21 기준으로 Markdown을 HTML로 바꾸는 도구와 보안 문서를 비교해 `markdown-to-html`에 반영한 판단이다.

## 확인한 원문

- CommonMark spec: `https://spec.commonmark.org/`
- markdown-it documentation: `https://markdown-it.github.io/markdown-it/`
- unified guide: `https://unifiedjs.com/learn/guide/using-unified/`
- remark-rehype: `https://github.com/remarkjs/remark-rehype`
- rehype-sanitize: `https://github.com/rehypejs/rehype-sanitize`
- OWASP Cross Site Scripting Prevention Cheat Sheet: `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html`
- DOMPurify: `https://github.com/cure53/DOMPurify`

## 채택한 기준

- CommonMark 계열 parser는 문서를 block 단계와 inline 단계로 나눠 해석한다. 따라서 줄 단위 문자열 치환보다 parser, token stream, AST를 먼저 사용한다.
- `markdown-it`은 `html` option을 꺼둔 상태가 기본이다. raw HTML을 켜는 방식은 이 repo의 standalone `skill.html` 기본값으로 쓰지 않는다.
- unified 계열은 `remark-parse` -> `remark-rehype` -> `rehype-stringify`처럼 Markdown AST와 HTML AST를 분리한다. 이 구조를 `MarkdownHtmlModel` 추출의 참고 모델로 삼는다.
- raw HTML을 허용해야 하는 특수한 경우에는 `rehype-raw` 같은 raw parser 뒤에 `rehype-sanitize` 또는 DOMPurify 같은 allowlist sanitizer를 마지막 unsafe transform 이후에 둔다.
- OWASP XSS guidance와 DOMPurify 문서는 sanitizer 이후에 DOM을 다시 위험하게 바꾸면 방어가 깨질 수 있다고 본다. 그래서 template render와 sanitize 순서를 고정한다.
- Docusaurus, MkDocs, GitHub Markdown, Eleventy, Hugo 같은 문서 도구는 heading, list, table, code fence, link 의미를 보존한다. `markdown-to-html`도 Markdown 원문을 UI 카드로 재해석하기보다 문서 의미를 짧게 보존한다.

## 적용하지 않은 기준

- raw HTML pass-through는 기본값으로 쓰지 않는다.
- Markdown 안의 event handler, `javascript:` URL, 외부 script, 외부 image는 HTML로 통과시키지 않는다.
- 문서에 수치가 없으면 차트를 만들지 않는다.
- 원문에 실제 흐름이나 관계가 없으면 diagram을 만들지 않는다.
- UI 배치 의도, 색상 구분 방식, 보기 방식에 대한 자기해설을 HTML 본문에 쓰지 않는다.
