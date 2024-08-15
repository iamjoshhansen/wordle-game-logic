import { expect } from 'chai';
import { AcceptanceError, GameState, TileState, WordleGameLogic } from '../src/';

const words = `
apple
alpha
bravo
delta
sauce
tiger
limit
`.split('\n');

function getTileRowFactory(correct:string) {
  return (guess:string) => WordleGameLogic.getStates(correct,guess).map((state, i) => ({
    letter: guess.toUpperCase().charAt(i),
    state,
  }));
}

function getGuessRow(guess:string) {
  const row = new Array(5).fill(null).map(x => ({
    letter: '',
    state: TileState.empty,
  }));
  // console.log(row);
  for (let i=0; i<guess.length; i++) {
    // console.log(`Assigning ${i} to ${guess[i]}`);
    row[i].letter = guess[i];
    row[i].state = TileState.guess;
  }
  return row;
}
const emptyRow = getGuessRow('');

describe('WordleGame.getStates', () => {
  it('APPLE & APPLE', () => {
    expect(WordleGameLogic.getStates('APPLE','APPLE')).to.eql([
      TileState.correct,
      TileState.correct,
      TileState.correct,
      TileState.correct,
      TileState.correct,
    ]);
  });

  it('ZEBRA & COINS', () => {
    expect(WordleGameLogic.getStates('ZEBRA','COINS')).to.eql([
      TileState.absent,
      TileState.absent,
      TileState.absent,
      TileState.absent,
      TileState.absent,
    ]);
  });

  it('PRINT & APPLE', () => {
    expect(WordleGameLogic.getStates('PRINT','APPLE')).to.eql([
      TileState.absent,
      TileState.near,
      TileState.absent,
      TileState.absent,
      TileState.absent,
    ]);
  });

  it('SPREE & EERIE', () => {
    expect(WordleGameLogic.getStates('SPREE','EERIE')).to.eql([
      TileState.near,
      TileState.absent,
      TileState.correct,
      TileState.absent,
      TileState.correct,
    ]);
  });

  it('APPLE & ALPHA', () => {
    const summary = (x:string) => x.charAt(0).toUpperCase();

    expect(WordleGameLogic.getStates('APPLE','ALPHA').map(summary).join('')).to.eql([
      TileState.correct,
      TileState.near,
      TileState.correct,
      TileState.absent,
      TileState.absent,
    ].map(summary).join(''));
  });

  
});

describe('WordleGame', () => {

  describe('Initial State', () => {
    let game: WordleGameLogic;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
    });

    it('is playing', () => {
      expect(game.state).to.equal(GameState.playing);
    });

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: emptyRow
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
    });
  });

  describe('can start typing (setting input)', () => {
    let game: WordleGameLogic;
    
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: getGuessRow('A'),
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'A', state: TileState.guess },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'A', state: TileState.guess },
            { letter:'Z', state: TileState.guess },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'A', state: TileState.guess },
            { letter:'P', state: TileState.guess },
            { letter:'P', state: TileState.guess },
            { letter:'L', state: TileState.guess },
            { letter:'E', state: TileState.guess },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'A', state: TileState.guess },
            { letter:'P', state: TileState.guess },
            { letter:'P', state: TileState.guess },
            { letter:'L', state: TileState.guess },
            { letter:'', state: TileState.empty },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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
      expect(game.state).to.equal(GameState.won);
    });

    it('input was cleared', () => {
      expect(game.input).to.equal('');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql(['APPLE']);
    });

    it('board is correct', () => {
      const getTileRow = getTileRowFactory(game.answer);
      
      expect(game.board).eql([
        {
          flipped: true,
          tiles: getTileRow('apple')
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
    });
  });

  describe('after winning, input is ignored', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'apple';
      error = game.acceptCurrentInput();
      game.addLetterToInput('Z');
    });

    it('no error was returned', () => {
      expect(error).to.equal(AcceptanceError.none);
    });
    
    it('game state is still success', () => {
      expect(game.state).to.equal(GameState.won);
    });

    it('input is still empty', () => {
      expect(game.input).to.equal('');
    });

    it('game guesses is an array of just that guess', () => {
      expect(game.guesses).to.eql(['APPLE']);
    });

    it('board is correct', () => {
      const getTileRow = getTileRowFactory(game.answer);
      
      expect(game.board).eql([
        {
          flipped: true,
          tiles: getTileRow('apple')
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
    });
  });

  describe('Can input unknown words', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'zebra';
    });

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'Z', state: TileState.guess },
            { letter:'E', state: TileState.guess },
            { letter:'B', state: TileState.guess },
            { letter:'R', state: TileState.guess },
            { letter:'A', state: TileState.guess },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
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
  });

  describe('does not accept unknown words', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'zebra';
      error = game.acceptCurrentInput();
    });

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'Z', state: TileState.guess },
            { letter:'E', state: TileState.guess },
            { letter:'B', state: TileState.guess },
            { letter:'R', state: TileState.guess },
            { letter:'A', state: TileState.guess },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
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
  });

  describe('accepts known words', () => {
    let game: WordleGameLogic;
    let error: string;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'sauce';
      error = game.acceptCurrentInput();
    });

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: true,
          tiles: [
            { letter:'S', state: TileState.absent },
            { letter:'A', state: TileState.near },
            { letter:'U', state: TileState.absent },
            { letter:'C', state: TileState.absent },
            { letter:'E', state: TileState.correct },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
      ]);
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

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: true,
          tiles: [
            { letter:'S', state: TileState.absent },
            { letter:'A', state: TileState.near },
            { letter:'U', state: TileState.absent },
            { letter:'C', state: TileState.absent },
            { letter:'E', state: TileState.correct },
          ]
        },
        {
          flipped: false,
          tiles: [
            { letter:'A', state: TileState.guess },
            { letter:'P', state: TileState.guess },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
            { letter:'', state: TileState.empty },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
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
  });

  describe('allows but clips long guesses', () => {
    let game: WordleGameLogic;
    
    beforeEach(() => {
      game = new WordleGameLogic('apple', words);
      game.input = 'tiger_bones';
    });

    it('board is correct', () => {
      expect(game.board).eql([
        {
          flipped: false,
          tiles: [
            { letter:'T', state: TileState.guess },
            { letter:'I', state: TileState.guess },
            { letter:'G', state: TileState.guess },
            { letter:'E', state: TileState.guess },
            { letter:'R', state: TileState.guess },
          ]
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
        {
          flipped: false,
          tiles: emptyRow,
        },
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

    it('board is correct', () => {
      const getTileRow = getTileRowFactory(game.answer);

      expect(game.board).eql([
        {
          flipped: true,
          tiles: getTileRow('alpha'),
        },
        {
          flipped: true,
          tiles: getTileRow('bravo'),
        },
        {
          flipped: true,
          tiles: getTileRow('delta'),
        },
        {
          flipped: true,
          tiles: getTileRow('sauce'),
        },
        {
          flipped: true,
          tiles: getTileRow('tiger'),
        },
        {
          flipped: true,
          tiles: getTileRow('limit'),
        },
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
      expect(game.state).to.equal(GameState.lost);
    });

    it('input is unchanged', () => {
      expect(game.input).to.equal('');
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

    it('board is correct', () => {
      const getTileRow = getTileRowFactory(game.answer);

      expect(game.board).eql([
        {
          flipped: true,
          tiles: getTileRow('alpha'),
        },
        {
          flipped: true,
          tiles: getTileRow('bravo'),
        },
        {
          flipped: true,
          tiles: getTileRow('delta'),
        },
        {
          flipped: true,
          tiles: getTileRow('sauce'),
        },
        {
          flipped: true,
          tiles: getTileRow('tiger'),
        },
        {
          flipped: true,
          tiles: getTileRow('limit'),
        },
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
      expect(game.state).to.equal(GameState.lost);
    });

    it('input is unchanged', () => {
      expect(game.input).to.equal('');
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
  });
});
