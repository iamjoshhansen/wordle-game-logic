import { expect } from 'chai';
import { AcceptanceError, GameState, TileState, WordleGameLogic } from '../src/wordle-game';

const words = `
apple
alpha
bravo
delta
sauce
tiger
limit
`.split('\n');

describe('WordleGame', () => {
  describe('Initial State', () => {
    let game: WordleGameLogic;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
    });

    it('is playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can start typing (setting input)', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'a';
    });

    it('input is A', () => {
      expect(game.input).to.equal('A');
    });

    it('game guesses is still empty', () => {
      expect(game.guesses).to.eql([]);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'A    ',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can start typing (adding a letter)', () => {
    let game: WordleGameLogic;
    let letter: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      letter = game.addLetterToInput('a');
    });

    it('added letter is A', () => {
      expect(letter).to.equal('A');
    });

    it('input is A', () => {
      expect(game.input).to.equal('A');
    });

    it('game guesses is still empty', () => {
      expect(game.guesses).to.eql([]);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'A    ',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can add a second letter', () => {
    let game: WordleGameLogic;
    let letter: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      letter = game.addLetterToInput('a');
      letter = game.addLetterToInput('z');
    });

    it('added letter is Z', () => {
      expect(letter).to.equal('Z');
    });

    it('input is AZ', () => {
      expect(game.input).to.equal('AZ');
    });

    it('game guesses is still empty', () => {
      expect(game.guesses).to.eql([]);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'AZ   ',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.guess, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can call add letter when size is reached, but nothing changes', () => {
    let game: WordleGameLogic;
    let letter: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      letter = game.addLetterToInput('a');
      letter = game.addLetterToInput('p');
      letter = game.addLetterToInput('p');
      letter = game.addLetterToInput('l');
      letter = game.addLetterToInput('e');
      
      letter = game.addLetterToInput('x');
    });

    it('added letter is empty string', () => {
      expect(letter).to.equal('');
    });

    it('input is APPLE', () => {
      expect(game.input).to.equal('APPLE');
    });

    it('game guesses is still empty', () => {
      expect(game.guesses).to.eql([]);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'APPLE',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.guess, TileState.guess, TileState.guess, TileState.guess],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can delete a letter', () => {
    let game: WordleGameLogic;
    let letter: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'apple';
      letter = game.removeLetterFromInput();
    });

    it('removed letter is "E"', () => {
      expect(letter).to.equal('E');
    });

    it('input is APPL', () => {
      expect(game.input).to.equal('APPL');
    });

    it('game guesses is still empty', () => {
      expect(game.guesses).to.eql([]);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'APPL ',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.guess, TileState.guess, TileState.guess, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can call delete a letter from empty input, but nothing changes', () => {
    let game: WordleGameLogic;
    let letter: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      letter = game.removeLetterFromInput();
    });

    it('removed letter is empty string', () => {
      expect(letter).to.equal('');
    });

    it('input is empty', () => {
      expect(game.input).to.equal('');
    });

    it('game guesses is still empty', () => {
      expect(game.guesses).to.eql([]);
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('can win on the first try', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'apple';
      error = game.acceptCurrentInput();
    });

    it('no error was returned', () => {
      expect(error).to.equal(AcceptanceError.none);
    });
    
    it('game state has changed to success', () => {
      expect(game.state).to.equal(GameState.success);
    });

    it('input was cleared', () => {
      expect(game.input).to.equal('');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql(['APPLE']);
    });

    it('the first row is flipped', () => {
      expect(game.allFlipped).to.eql([ true, false, false, false, false, false ]);
    });
  });

  describe('Can input unknown words', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'zebra';
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'ZEBRA',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.guess, TileState.guess, TileState.guess, TileState.guess],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });
    
    it('game state still playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('input remains as-is', () => {
      expect(game.input).to.equal('ZEBRA');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql([]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('does not accept unknown words', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'zebra';
      error = game.acceptCurrentInput();
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'ZEBRA',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.guess, TileState.guess, TileState.guess, TileState.guess],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('error is Unknown word', () => {
      expect(error).to.equal(AcceptanceError.unknown_word);
    });
    
    it('game state still playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('input remains as-is', () => {
      expect(game.input).to.equal('ZEBRA');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql([]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('accepts known words', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'sauce';
      error = game.acceptCurrentInput();
    });

    it('rows is "SAUCE" followed by 5 SPACES', () => {
      expect(game.allRows).eql([
        'SAUCE',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.absent, TileState.near, TileState.absent, TileState.absent, TileState.correct],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('the first row is flipped', () => {
      expect(game.allFlipped).to.eql([ true, false, false, false, false, false ]);
    });

    it('error empty', () => {
      expect(error).to.equal(AcceptanceError.none);
    });
    
    it('game state still playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('input has been cleared', () => {
      expect(game.input).to.equal('');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql(['SAUCE']);
    });

    it('first row is flipped', () => {
      expect(game.allFlipped).to.eql([ true, false, false, false, false, false ]);
    });
  });

  describe('can type after accepted guess', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'sauce';
      error = game.acceptCurrentInput();
      game.input = 'ap';
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'SAUCE',
        'AP   ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.absent, TileState.near, TileState.absent, TileState.absent, TileState.correct],
        [TileState.guess, TileState.guess, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });

    it('error empty', () => {
      expect(error).to.equal(AcceptanceError.none);
    });
    
    it('game state still playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('input is AP', () => {
      expect(game.input).to.equal('AP');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql(['SAUCE']);
    });

    it('first row is flipped', () => {
      expect(game.allFlipped).to.eql([ true, false, false, false, false, false ]);
    });
  });

  describe('allows but clips long guesses', () => {
    let game: WordleGameLogic;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'tiger_bones';
    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'TIGER',
        '     ',
        '     ',
        '     ',
        '     ',
        '     ',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.guess, TileState.guess, TileState.guess, TileState.guess, TileState.guess],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
        [TileState.empty, TileState.empty, TileState.empty, TileState.empty, TileState.empty],
      ]);
    });
    
    it('game state still playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('input has been clipped', () => {
      expect(game.input).to.equal('TIGER');
    });

    it('game guesses is an empty array', () => {
      expect(game.guesses).to.eql([]);
    });

    it('nothing is flipped', () => {
      expect(game.allFlipped).to.eql([ false, false, false, false, false, false ]);
    });
  });

  describe('input has no effect when limit is reached', () => {
    let game: WordleGameLogic;
    let errors: string[];
    
    beforeEach(() => {
      errors = [];
      game = new WordleGameLogic('apple', words);

      game.input = 'alpha';
      errors.push(game.acceptCurrentInput());

      game.input = 'bravo';
      errors.push(game.acceptCurrentInput());

      game.input = 'delta';
      errors.push(game.acceptCurrentInput());

      game.input = 'sauce';
      errors.push(game.acceptCurrentInput());

      game.input = 'tiger';
      errors.push(game.acceptCurrentInput());

      game.input = 'limit';
      errors.push(game.acceptCurrentInput());

      game.input = 'what';

    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'ALPHA',
        'BRAVO',
        'DELTA',
        'SAUCE',
        'TIGER',
        'LIMIT',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.correct, TileState.near, TileState.correct, TileState.absent, TileState.near],
        [TileState.absent, TileState.absent, TileState.near, TileState.absent, TileState.absent],
        [TileState.absent, TileState.near, TileState.near, TileState.absent, TileState.near],
        [TileState.absent, TileState.near, TileState.absent, TileState.absent, TileState.correct],
        [TileState.absent, TileState.absent, TileState.absent, TileState.near, TileState.absent],
        [TileState.near, TileState.absent, TileState.absent, TileState.absent, TileState.absent],
      ]);
    });

    it('errors are 6 x none', () => {
      expect(errors).to.eql([
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
      ]);
    });
    
    it('game state is now failure', () => {
      expect(game.state).to.equal(GameState.failure);
    });

    it('input is unchanged', () => {
      expect(game.input).to.equal('WHAT');
    });

    it('game guesses is correct', () => {
      expect(game.guesses).to.eql([
        'ALPHA',
        'BRAVO',
        'DELTA',
        'SAUCE',
        'TIGER',
        'LIMIT',
      ]);
    });

    it('All 6 rows are flipped', () => {
      expect(game.allFlipped).to.eql([ true, true, true, true, true, true ]);
    });
  });

  describe('does not accept input when limit is reached', () => {
    let game: WordleGameLogic;
    let errors: string[];
    
    beforeEach(() => {
      errors = [];
      game = new WordleGameLogic('apple', words);

      game.input = 'alpha';
      errors.push(game.acceptCurrentInput());

      game.input = 'bravo';
      errors.push(game.acceptCurrentInput());

      game.input = 'delta';
      errors.push(game.acceptCurrentInput());

      game.input = 'sauce';
      errors.push(game.acceptCurrentInput());

      game.input = 'tiger';
      errors.push(game.acceptCurrentInput());

      game.input = 'limit';
      errors.push(game.acceptCurrentInput());

      game.input = 'what';
      errors.push(game.acceptCurrentInput());

    });

    it('has the right rows', () => {
      expect(game.allRows).eql([
        'ALPHA',
        'BRAVO',
        'DELTA',
        'SAUCE',
        'TIGER',
        'LIMIT',
      ]);
    });

    it('has the right colors', () => {
      expect(game.allColors).to.eql([
        [TileState.correct, TileState.near, TileState.correct, TileState.absent, TileState.near],
        [TileState.absent, TileState.absent, TileState.near, TileState.absent, TileState.absent],
        [TileState.absent, TileState.near, TileState.near, TileState.absent, TileState.near],
        [TileState.absent, TileState.near, TileState.absent, TileState.absent, TileState.correct],
        [TileState.absent, TileState.absent, TileState.absent, TileState.near, TileState.absent],
        [TileState.near, TileState.absent, TileState.absent, TileState.absent, TileState.absent],
      ]);
    });

    it('errors are 6 x none', () => {
      expect(errors).to.eql([
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.none,
        AcceptanceError.out_of_guesses,
      ]);
    });
    
    it('game state is still failure', () => {
      expect(game.state).to.equal(GameState.failure);
    });

    it('input is unchanged', () => {
      expect(game.input).to.equal('WHAT');
    });

    it('game guesses is correct', () => {
      expect(game.guesses).to.eql([
        'ALPHA',
        'BRAVO',
        'DELTA',
        'SAUCE',
        'TIGER',
        'LIMIT',
      ]);
    });

    it('All 6 rows are flipped', () => {
      expect(game.allFlipped).to.eql([ true, true, true, true, true, true ]);
    });
  });
});
