## Project Skills

- Use $markdown-to-comic at <skills-root>/skills/markdown-to-comic/SKILL.md when a Markdown document should become an $imagegen-based 4-panel or 6-panel raster comic saved under that document's `comic/` folder with an HTML wrapper, transcript, source anchors, and accessibility notes.

## Project-Specific Overrides

- Treat the source Markdown as the source of truth; comic output is an understanding aid, not a replacement.
- Use $imagegen as the default generation path. Storyboard-only or HTML-only output is allowed only when explicitly requested or when image generation is blocked.
- Save accepted project-bound outputs as `comic/comic.png` and `comic/comic.html` beside the source document folder, such as `skills/<skill-name>/comic/` for shared skills.
- Use 4-panel comics for one compact concept, decision, or misconception correction.
- Use 6-panel comics for workflows, failure recovery, or cause-and-effect sequences.
- Keep commands, security rules, exact policy wording, and code as text outside raster images.
- Do not paste raw Markdown directly into image prompts; convert to a reviewed `ComicBrief` first.
- Include panel source anchors, alt text, long descriptions, and a text transcript.
