---
name: pirate-memory-riddle-content
description: Create and maintain riddle data for the pirate memory game. Use when adding, editing, or reviewing riddles in riddles.js, designing map clues, or balancing question difficulty.
---

# Pirate Memory Riddle Content

Help create and maintain riddle data for the pirate memory game.

## Riddle design rules

- Each riddle represents one memory clue from the treasure map.
- The clue should be visually clear and easy to recognize.
- In the final game, the map should rely on visuals, not written text.
- The first prototype may use emoji and `hintLabel` as placeholders.
- The clue must connect directly to the question.
- Each question must have exactly 4 answer options.
- Only one answer should be correct.
- Avoid ambiguous answers.
- Avoid making wrong answers too similar in the early prototype.
- Prefer iconic pirate/adventure objects:
  - gold
  - parrot
  - anchor
  - skull
  - compass
  - coconut
  - lighthouse
  - bottle
  - cannon
  - crab
  - shark
  - shell
  - key
  - moon
  - treasure chest

## Riddle object format

```javascript
{
  id: string,
  hintEmoji: string,
  hintLabel: string,
  question: string,
  options: string[],
  correctIndex: number,
  islandTitle: string,
  characterName: string,
  failTitle: string,
  failText: string
}
```

## Future image fields

```javascript
{
  hintImage: string,
  islandBackgroundImage: string,
  characterImage: string,
  loseImage: string
}
```

## Important

- Do not put game logic inside riddle objects.
- Do not hardcode riddle ids inside game flow.
- Do not assume a fixed island order.
- The game should be able to select any valid riddle from the pool.

## Difficulty guidance

**Easy:**
- Wrong answers are clearly different from the correct answer.

**Medium:**
- Wrong answers are from the same theme but still distinct.

**Hard:**
- Wrong answers are visually or semantically close to the correct answer.

## For the first prototype

- Use mostly easy riddles.
- Use at least 8 riddles in the pool.
- Play only 3 islands by default.
