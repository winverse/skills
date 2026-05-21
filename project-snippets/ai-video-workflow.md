## AI Video Workflow Skill

- Use $ai-video-workflow at `<skills-root>/plugins/ai-video-workflow/skills/ai-video-workflow/SKILL.md` when the user wants to turn a script, transcript, or video idea into a narrated motion-graphics video using a consented Voicebox voice profile or private own-voice sample and HyperFrames HTML video rendering.
- Before using a voice sample, record that it is the user's own voice or an explicitly consented voice. If consent or usage scope is unclear, stop before cloning or generating speech.
- Keep raw voice samples out of shared repos. Store samples only in ignored project-private paths such as `assets/private/voice-samples/` or inside Voicebox profiles.
- Run `node <skills-root>/plugins/ai-video-workflow/scripts/doctor.ts` before setup, and use `--require-voicebox` before actual speech generation.
- Use `node <skills-root>/plugins/ai-video-workflow/scripts/scaffold-video-project.ts <target-dir>` to create the project brief structure, then validate it with `node <skills-root>/plugins/ai-video-workflow/scripts/validate-video-project.ts <target-dir>`.

