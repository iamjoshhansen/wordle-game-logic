export enum GameState {
  playing = 'playing',
  success = 'success',
  failure = 'failure',
}

export enum TileState {
  empty = 'empty',
  guess = 'guess',
  absent = 'absent',
  near = 'near',
  correct = 'correct',
}

export enum AcceptanceError {
  none = '',
  out_of_guesses = 'Out of guesses',
  letter_count = 'Incorrect size',
  unknown_word = 'Not in word list',
}

export class WordleGame {
  private _state = GameState.playing;
  private set state(state:GameState) {
    this._state = state;
  }
  get state(): GameState {
    return this._state;
  }

  public readonly answer: string;
  private readonly allWordsSet: Set<string>;
  private readonly size: number;

  private readonly _guesses: string[] = [];
  get guesses() {
    return [...this._guesses];
  }

  private _input = '';
  get input() {
    return this._input;
  }
  set input(word:string) {
    this._input = word
      .substring(0,5)
      .toUpperCase();
  }

  get allRows(): string[] {
    const result = [...this.guesses];
    
    if (result.length >= this.limit) {
      return result;
    }

    result.push(this.input.padEnd(this.size,' '));
    
    if (result.length >= this.limit) {
      return result;
    }
    
    const remaining = this.limit - result.length;
    for (let i=0; i<remaining; i++) {
      result.push(' '.repeat(this.size));
    }

    return result;
  }

  get allColors(): TileState[][] {
    return this.allRows.map((word,row) => {
      return word.padEnd(this.size,' ').split('').map((char, i) => {

        if (row > this.guesses.length) {
          return TileState.empty;
        }

        if (row == this.guesses.length) {
          return i < this.input.length
            ? TileState.guess
            : TileState.empty
        }

        const e = this.answer.charAt(i);
        return e === char
          ? TileState.correct
          : this.answer.includes(char)
            ? TileState.near
            : TileState.absent
      });
    });
  }

  get allFlipped(): boolean[] {
    return this.allRows.map((_,row) => {
      return row < this.guesses.length;
    });
  }

  constructor(answer: string, words:string, public readonly limit=6) {
    this.answer = answer.toUpperCase();
    this.size = answer.length;
    this.allWordsSet = new Set(words
        .split('\n')
        .map(x => x.trim())
        .filter(x => x.length === this.size)
        .map(x => x.toUpperCase())
    );
  }

  /**
   * Adds a word to the pool of guesses.
   * Good to bind with ENTER
   * @param word the word to be added as a guess
   * @returns AAcceptanceError: message for why the word could not be added (empty string on success)
   */
  acceptCurrentInput(): AcceptanceError {
    const word = this.input;

    if (this._guesses.length >= this.limit) {
      return AcceptanceError.out_of_guesses;
    }
    
    if (word.length !== this.size) {
      return AcceptanceError.letter_count;
    }

    if (!this.allWordsSet.has(word)) {
      return AcceptanceError.unknown_word;
    }

    this._guesses.push(word);
    this.input = '';

    if (word === this.answer) {
      this.state = GameState.success;
    } else if (this._guesses.length === this.limit) {
      this.state = GameState.failure;
    }

    return AcceptanceError.none;
  }

  /**
   * Adds one character to the input.
   * Does nothing if input is already full.
   * Good to bind with letter keys
   * @param char the character to be added. Only accepts first character. Does nothing if char is empty.
   * @returns the character added. Empty if input did not change
   */
  addLetterToInput(char:string): string {
    if (this.input.length >= this.size) {
      return '';
    }
    
    if (char.length === 0) {
      return '';
    }

    const c = char.charAt(0).toUpperCase();
    this.input += c;
    return c;
  }

  /**
   * Removes the last letter from the input.
   * Does nothing if input was already empty.
   * Good to bind with BACKSPACE
   * @returns the character removed. (empty string if input was already empty)
   */
  removeLetterFromInput(): string {
    if (this.input.length === 0) {
      return '';
    }

    const arr = this.input.split('');
    const c = arr.pop() as string;

    this.input = arr.join('');
    return c;
  }
}
