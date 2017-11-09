/* Copyright G. Hemingway, @2017 */
'use strict';


let shuffleCards = (includeJokers = false) => {
    //return [{ "suit": "clubs", "value": 7 }, { "suit": "diamonds", "value": 12 }];

    /* Return an array of 52 cards (if jokers is false, 54 otherwise). Carefully follow the instructions in the README */
    let cards = [];
    ['spades', 'clubs', 'hearts', 'diamonds'].forEach(suit => {
        ['ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'jack', 'queen', 'king'].forEach(value => {
            cards.push({ suit: suit, value: value });
        });
    });
    // Add in jokers here
    if (includeJokers) {/*...*/}
    // Now shuffle
    let deck = [];
    while (cards.length > 0) {
        // Find a random number between 0 and cards.length - 1
        const index = Math.floor((Math.random() * cards.length));
        deck.push(cards[index]);
        cards.splice(index, 1);
    }
    return deck;
};

let initialState = () => {
    /* Use the above function.  Generate and return an initial state for a game */
    let state = {
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10),
        pile1: [],
        pile2: [],
        pile3: [],
        pile4: [],
        pile5: [],
        pile6: [],
        pile7: [],
        stack1: [],
        stack2: [],
        stack3: [],
        stack4: [],
        draw: [],
        discard: []
    };

    // Get the shuffled deck and distribute it to the players
    const deck = shuffleCards(false);
    // Setup the piles
    for (let i = 1; i <= 7; ++i) {
        let card = deck.splice(0, 1)[0];
        card.up = true;
        state[`pile${i}`].push(card);
        for (let j = i+1; j <= 7; ++j) {
            card = deck.splice(0, 1)[0];
            card.up = false;
            state[`pile${j}`].push(card);
        }
    }
    // Finally, get the draw right
    state.draw = deck.map(card => {
        card.up = false;
        return card;
    });
    return state;
};


let filterForProfile = game => ({
    id:         game._id,
    game:       game.game,
    color:      game.color,
    draw:       game.drawCount,
    start:      game.start,
    winner:     game.winner,
    score:      game.score,
    cards_remaining: 99,
    active:     game.active,
    moves:      game.moves.length
});


let validMoves = state => {
    let moves = [];
    this.addAllMovesForStack(moves, "stack1", this.state.stack1);
    this.addAllMovesForStack(moves, "stack2", this.state.stack2);
    this.addAllMovesForStack(moves, "stack3", this.state.stack3);
    this.addAllMovesForStack(moves, "stack4", this.state.stack4);
    this.addAllMovesForPile(moves, "pile1", this.state.pile1);
    this.addAllMovesForPile(moves, "pile2", this.state.pile2);
    this.addAllMovesForPile(moves, "pile3", this.state.pile3);
    this.addAllMovesForPile(moves, "pile4", this.state.pile4);
    this.addAllMovesForPile(moves, "pile5", this.state.pile5);
    this.addAllMovesForPile(moves, "pile6", this.state.pile6);
    this.addAllMovesForPile(moves, "pile7", this.state.pile7);

    console.log(moves);

    return moves;
};

let validateMove = (state, requestedMove) => {
    const moves = validMoves(state);
    if (moves.includes(requestedMove)) {
        return requestedMove;
    }
    return { error: "The requested move is invalid" };
};

let addAllMovesForStack = (moves, dst, dstArr) => {
    let move = this.findMoveForStack(dst, this.getValidMoveToStack(dstArr[dstArr.length - 1]));
    if (move.length > 0) {
        moves.push(move);
    }
};

let addAllMovesForPile = (moves, dst, dstArr) => {
    let move = this.findMoveForPile(dst, this.getValidMoveToPile(dstArr[dstArr.length - 1]));
    if (move.length > 0) {
        moves.push(move);
    }
}

let findMoveForStack = (pile, card) => {
    if (!card) {
        return null;
    }

    console.log(`IN FINDMOVEFORSTACK: ${pile} ${card.suit} ${card.value}`);

    let moves = [];
    this.createSingleMove(this.state.discard, "discard", pile, card, moves);
    this.createSingleMove(this.state.pile1, "pile1", pile, card, moves);
    this.createSingleMove(this.state.pile2, "pile2", pile, card, moves);
    this.createSingleMove(this.state.pile3, "pile3", pile, card, moves);
    this.createSingleMove(this.state.pile4, "pile4", pile, card, moves);
    this.createSingleMove(this.state.pile5, "pile5", pile, card, moves);
    this.createSingleMove(this.state.pile6, "pile6", pile, card, moves);
    this.createSingleMove(this.state.pile7, "pile7", pile, card, moves);

    return moves;
};

let findMoveForPile = (pile, card) => {
    if (!card) {
        return null;
    }

    console.log(`IN FINDMOVEFORPILE: ${pile} ${card.suit} ${card.value}`);

    let moves = [];
    this.createSingleMove(this.state.discard, "discard", pile, card, moves);
    this.createSingleMove(this.state.stack1, "stack1", pile, card, moves);
    this.createSingleMove(this.state.stack2, "stack2", pile, card, moves);
    this.createSingleMove(this.state.stack3, "stack3", pile, card, moves);
    this.createSingleMove(this.state.stack4, "stack4", pile, card, moves);
    this.createMoves(this.state.pile1, "pile1", pile, card, moves);
    this.createMoves(this.state.pile2, "pile2", pile, card, moves);
    this.createMoves(this.state.pile3, "pile3", pile, card, moves);
    this.createMoves(this.state.pile4, "pile4", pile, card, moves);
    this.createMoves(this.state.pile5, "pile5", pile, card, moves);
    this.createMoves(this.state.pile6, "pile6", pile, card, moves);
    this.createMoves(this.state.pile7, "pile7", pile, card, moves);

    return moves;
};

let getValidMoveToPile = card => {
    if (!card) {
        return {
            suit: ["clubs", "spades", "diamonds", "hearts"],
            value: "king"
        };
    }

    if (card.value === "ace") {
        return null;
    }

    let black = ["clubs", "spades"];
    let red = ["diamonds", "hearts"];
    let newSuit = black.includes(card.suit) ? red : black;

    let parseValue = {
        jack: 11,
        queen: 12,
        king: 13
    }
    let value = isNaN(card.value) ? parseValue[card.value] - 1 : card.value - 1;

    let createValue = {
        1: "ace",
        11: "jack",
        12: "queen",
    }
    let newValue = value > 10 || value === 1 ? createValue[value] : value;

    console.log("CARD TO FIND: " + newSuit + " " + newValue);

    return {
        suit: newSuit,
        value: newValue
    };
};

let getValidMoveToStack = card => {
    console.log(card);
    if (!card) {
        return {
            suit: ["clubs", "spades", "diamonds", "hearts"],
            value: "ace"
        };
    }

    if (card.value === "king") {
        console.log("RETURN NULL");
        return null;
    }

    let parseValue = {
        ace: 1,
        jack: 11,
        queen: 12,
    }
    let value = isNaN(card.value) ? parseValue[card.value] + 1 : +card.value + 1;

    console.log(card.value);
    console.log(value);

    let createValue = {
        11: "jack",
        12: "queen",
        13: "king"
    }
    let newValue = value > 10 ? createValue[value] : value;

    console.log("CARD TO FIND: " + card.suit + " " + newValue);

    return {
        suit: card.suit,
        value: newValue
    };
};

let createSingleMove = (srcArr, src, dst, card, moves) => {
    if (srcArr.length < 1) {
        return;
    }

    let curCard = srcArr[srcArr.length - 1]
    if (curCard.value === card.value && card.suit.includes(curCard.suit)) {
        moves.push({
            cards: [{
                suit: curCard.suit, value: curCard.value
            }],
            src: src,
            dst: dst
        });
    }
};

let createMoves = (srcArr, src, dst, card, moves) => {
    if (srcArr.length < 1 || srcArr === dst) {
        return;
    }

    for (let curCard of srcArr) {
        if (curCard.up && curCard.value === card.value && card.suit.includes(curCard.suit)) {
            moves.push({
                cards: [{
                    suit: curCard.suit, value: curCard.value
                }],
                src: src,
                dst: dst
            });
            break;
        }
    }
};

module.exports = {
    shuffleCards: shuffleCards,
    initialState: initialState,
    filterForProfile: filterForProfile,
    validateMove: validateMove
};