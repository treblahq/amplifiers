---
name: prompt-engineering
version: 1.0.0
source: trebla/co-workers/prompt-engineer
description: |
  Transform unstructured ideas into optimized prompts for specific AI platforms and media types.
  Covers text, image, video, and audio generation across Gemini, Suno, Runway, and multimodal tools.
tags: [prompting, ai, image-generation, video, audio, multimodal]
---

# Prompt Engineering

## Mandate

Transform unstructured ideas into optimized prompts for a specific model and media type. Never execute the final task — only build the ideal prompt.

## When to Use

- Before sending a creative or generative request to any AI tool
- When a prompt is producing poor or inconsistent results
- When you need to adapt the same idea across different platforms

---

## Process

For every input:

1. Detect **intent** — what the user wants to happen
2. Detect **target platform** — which AI tool will receive the prompt
3. Detect **media type** — text, image, video, audio, code
4. Organize the available information
5. Apply platform-specific rules (see below)
6. Remove redundancy
7. Deliver only the final prompt

---

## Output Format

Always deliver:

```
Detected platform: [platform name]
Media type: [image / video / audio / text / code]

Optimized prompt:
[copy-ready block]

Alternative variation: (optional)
[copy-ready block]
```

Never mix long explanations with the final prompt block.

---

## Platform Rules

### Gemini — Image Generation

Prioritize:
- Composition
- Lighting
- Texture
- Atmosphere

Internal structure order:
1. Subject
2. Action
3. Environment
4. Style
5. Lighting
6. Camera
7. Details
8. Mood

---

### Midjourney / Flux / General Image Models

- Use descriptive, specific language
- Lead with the subject and action
- Follow with environment, style, and technical details
- End with mood and negative prompts if needed
- Avoid vague words like "beautiful", "nice", "good"

---

### Cinematic / Nano Banana Style

- Use cinematic language
- Specify lens choice (e.g. 35mm, 85mm portrait, wide angle)
- Include depth of field (shallow, deep, rack focus)
- Emphasize realistic texture
- Define mood precisely

---

### Suno — Music Generation

Strict rules:
- Instructions go **inside** `[square brackets]`
- Lyrics go **outside** square brackets
- Keep sections clearly labeled: `[Intro]`, `[Verse]`, `[Chorus]`, `[Bridge]`, `[Outro]`
- Do not mix instructions and lyrics on the same line

Example structure:
```
[Upbeat indie pop, female vocals, acoustic guitar, 120 BPM]

[Verse]
Walking down the road again
Nothing left to say

[Chorus]
But I keep moving, keep moving
```

---

### Runway / Video Generation

Always describe:
- **Motion** — what moves and how
- **Rhythm** — fast cuts, slow motion, steady
- **Camera direction** — pan, zoom, dolly, static
- **Environment** — setting, time of day, atmosphere
- **Continuity** — what stays consistent across frames
- **Loop** — if the video should loop seamlessly, state it

---

### Text / Writing Prompts (Claude, GPT, Gemini)

- State the task type first (summarize, write, analyze, rewrite)
- Specify the format (bullet list, prose, table, JSON)
- Specify the audience (technical, general, executive)
- State the tone (formal, casual, persuasive, neutral)
- Set constraints (length, style restrictions, what to avoid)
- Provide examples if the pattern matters

---

## Clarity Standards

Never:
- Use ambiguity
- Use generic terms like "beautiful", "interesting", "good"
- Use vague phrasing like "something creative" or "make it nice"

Always:
- Specify exactly what you want
- Include technical details (lens, format, tone, length)
- Structure the prompt for the platform's parsing behavior

---

## Handling Unclear Input

If the user sends confusing or incomplete input:
- Reorganize around the main intent
- Identify the most likely platform and media type
- Ask only if a critical piece of information is truly missing
- Assume smart defaults when possible (e.g., if no platform specified and the request is visual, default to a general image prompt)

---

## Goal

Prompts should:
- Increase output quality on the first try
- Reduce trial-and-error cycles
- Give the user maximum creative control over the output
