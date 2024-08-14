# Wordle Game Logic

Framework agnostic.

To be used to manage the game.

## Usage
```typescript
import { WordleGameLogic } from '@this-is-josh-hansen/wordle-game-logic';

const words = `
alpha
bravo
delta
final
hello
`;

const gameLogic = new WordleGameLogic('hello', words);

logic.on('rows', rows => {
  // render the view with the updated game data
});

/**
 * Pass keyboard events to the game logic
 */
window.addEventListener('keydown', (event:KeyboardEvent) => {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }

  // Handle Backspace
  if (event.key === 'Backspace') {
    gameLogic.removeLetterFromInput();
    return;
  }

  // Handle Enter
  if (event.key === 'Enter') {
    gameLogic.acceptCurrentInput();
    return;
  }

  // Filter out non-letters
  if (event.key.length > 1 || !event.key.match(/[a-z]/i)) {
    return;
  }

  gameLogic.addLetterToInput(ev.key);
});
```
