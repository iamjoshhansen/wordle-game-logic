# Wordle Game Logic

Framework agnostic.

To be used to manage the game.

## Usage
```typescript
import { WordleGame } from 'iamjoshhansen/wordle-game-logic';

const words = `
alpha
bravo
delta
final
hello
`;

const game = new WordleGame('hello', words);

window.addEventListener('keydown', (event:KeyboardEvent) => {
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }

  // Handle Backspace
  if (event.key === 'Backspace') {
    game.removeLetterFromInput();
    return;
  }

  // Handle Enter
  if (event.key === 'Enter') {
    game.acceptCurrentInput();
    return;
  }

  // Filter out non-letters
  if (event.key.length > 1 || !event.key.match(/[a-z]/i)) {
    return;
  }

  game.addLetterToInput(ev.key);
});
```
