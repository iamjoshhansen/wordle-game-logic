import { createEmitterListener, EmitMethod, OnMethod } from "@this-is-josh-hansen/event-emitter";

export enum GameState {
  playing = 'playing',
  won = 'won',
  lost = 'lost',
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

export enum WordleGameLogicEvent {
  boardUpdate = 'boardUpdate',
  stateUpdate = 'stateUpdate',
  error = 'error',
}

type GameEvents = {
  [WordleGameLogicEvent.boardUpdate]: [snapshot:GameBoardSnapshot],
  [WordleGameLogicEvent.stateUpdate]: [state:GameState],
  [WordleGameLogicEvent.error]: [message:string],
};

interface GameBoardTile {
  letter: string,
  state: TileState,
}

interface GameBoardRow {
  flipped: boolean,
  tiles: GameBoardTile[],
}

export type GameBoardSnapshot = GameBoardRow[];

export class WordleGameLogic {
  private readonly emit: EmitMethod<GameEvents>;
  public readonly on: OnMethod<GameEvents>;

  private _state = GameState.playing;
  private set state(state:GameState) {
    const oldState = this.state;
    this._state = state;
    if (oldState !== this._state) {
      this.emit(WordleGameLogicEvent.stateUpdate, this._state);
    }
  }
  get state(): GameState {
    return this._state;
  }

  public readonly answer: string;
  private readonly allWordsSet: Set<string>;

  /**
   * Word Character Count
   */
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
    const oldWord = this._input;
    this._input = word
      .substring(0,5)
      .toUpperCase();
    
    if (this._input !== oldWord) {
      this.emit(WordleGameLogicEvent.boardUpdate, this.board);
    }
  }

  /**
   * An array of TileState
   * 
   * @example
   * Correct: ZEBRA
   * Guess  : COINS
   * No overlap.. all "absent"
   * 
   * @example
   * Correct: FARMS
   * Guess  : FARMS
   * All "correct"
   * 
   * @example
   * Correct: PRINT
   * Guess  : APPLE
   * - A: absent
   * - P: near
   * - P: absent (only one P can be "correct" or "near", which was just taken)
   * - L: absent
   * - E: absent
   * 
   * @example
   * Correct: SPREE
   * Guess  : EERIE
   * - E: near
   * - E: absent (the E at the end will "claim" that count)
   * - R: correct
   * - I: absent
   * - E: correct
   * 
   * @example
   * Correct: APPLE
   * Guess  : ALPHA
   * - A: correct
   * - L: near
   * - P: correct
   * - H: absent
   * - A: absent - the first A claimed it
   */
  static getStates(correctWord:string, guessWord:string): TileState[] {
    const correct = correctWord.toUpperCase();
    const guess = guessWord.toUpperCase();

    const states = new Array(correct.length).fill(TileState.absent);

    const correctCounts: Record<string, number> = {};
    for (const c of correct) {
      correctCounts[c] = (correctCounts[c] ?? 0) + 1;
    }

    const guessLetters = guess.split('');

    // fill in and account for all 'correct' letters
    guessLetters.forEach((g,i) => {
      const c = correct.charAt(i);
      if (c === g) {
        correctCounts[g]--;
        states[i] = TileState.correct;
      }
    });

    // fill in any remaining counts (from left to right) with 'near'
    guessLetters.forEach((g,i) => {
      if (states[i] === TileState.absent && correctCounts[g]) {
        correctCounts[g]--;
        states[i] = TileState.near;
      }
    });

    return states;
  }

  private *gameBoardRows(): Iterable<GameBoardRow> {
    let rowCount = 0;

    // 1. Yield Guesses
    for (const guess of this._guesses) {
      rowCount++;
      const states = WordleGameLogic.getStates(this.answer, guess);
      const tiles: GameBoardTile[] = guess
        .split('')
        .map((letter, i) => ({
          letter,
          state: states[i],
        }));
      
      yield {
        flipped: true,
        tiles,
      };
    }
    
    // Out of rows? Stop here
    if (rowCount >= this.guessLimit) {
      return;
    }

    // 2. Yield Input, if it's not empty
    if (this.input) {
      rowCount++;
      const tiles: GameBoardTile[] = new Array(this.size).fill(null).map((_,i) => {
        const letter = this.input[i] ?? '';
        const state = letter ? TileState.guess : TileState.empty;
        return { letter, state };
      });

      yield {
        flipped: false,
        tiles,
      };
    }

    // Out of rows? Stop here
    if (rowCount >= this.guessLimit) {
      return;
    }

    // Fill in the rest with empty tiles
    for (let i=rowCount; i<this.guessLimit; i++) {
      yield {
        flipped: false,
        tiles: new Array(this.size).fill({ letter:'', state:TileState.empty }),
      };
    }
  }

  get board(): GameBoardSnapshot {
    return [...this.gameBoardRows()];
  }

  constructor(answer: string, words:string[], public readonly guessLimit=6) {
    this.answer = answer.toUpperCase();
    this.size = answer.length;
    this.allWordsSet = new Set(words
        .map(x => x.trim())
        .filter(x => x.length === this.size)
        .map(x => x.toUpperCase())
    );

    const { emit, listener } = createEmitterListener<GameEvents>();
    this.emit = emit;
    this.on = listener.on;
  }

  /**
   * Adds a word to the pool of guesses.
   * Good to bind with ENTER
   * @param word the word to be added as a guess
   * @returns AAcceptanceError: message for why the word could not be added (empty string on success)
   */
  acceptCurrentInput(): AcceptanceError {
    const word = this.input;

    if (this._guesses.length >= this.guessLimit) {
      this.emit(WordleGameLogicEvent.error, AcceptanceError.out_of_guesses);
      return AcceptanceError.out_of_guesses;
    }
    
    if (word.length !== this.size) {
      this.emit(WordleGameLogicEvent.error, AcceptanceError.letter_count);
      return AcceptanceError.letter_count;
    }

    if (!this.allWordsSet.has(word)) {
      this.emit(WordleGameLogicEvent.error, AcceptanceError.unknown_word);
      return AcceptanceError.unknown_word;
    }

    this._guesses.push(word);
    this.input = ''; // triggers 'boardUpdate'

    if (word === this.answer) {
      this.state = GameState.won;
    } else if (this._guesses.length === this.guessLimit) {
      this.state = GameState.lost;
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

    if (this._guesses.length >= this.guessLimit) {
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
