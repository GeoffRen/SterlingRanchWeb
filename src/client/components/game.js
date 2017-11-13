/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router';

/*************************************************************************/

import { Pile } from './pile';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target: undefined,
            startDrag: { x: 0, y: 0 },
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
            discard: [],
        };

        this.escFunction     = this.escFunction.bind(this);
        this.onClick         = this.onClick.bind(this);
        this.createMove      = this.createMove.bind(this);
        this.removeHighlight = this.removeHighlight.bind(this);
        this.getCardInfo     = this.getCardInfo.bind(this);

        // this.validMoves = this.validMoves.bind(this);
        // this.getValidMoveToPile = this.getValidMoveToPile.bind(this);
        // this.getValidMoveToStack = this.getValidMoveToStack.bind(this);
        // this.findMoveForPile = this.findMoveForPile.bind(this);
        // this.findMoveForStack = this.findMoveForStack.bind(this);
        // this.createSingleMove = this.createSingleMove.bind(this);
        // this.createMoves = this.createMoves.bind(this);
        // this.addAllMovesForPile = this.addAllMovesForPile.bind(this);
        // this.addAllMovesForStack = this.addAllMovesForStack.bind(this);
    }

    // validMoves() {
    //     // let v = this.state.stack1;
    //     // console.log("TOP CARD: " + v[v.length - 1]);
    //     // let test = this.findMoveForPile("pile3", this.getValidMoveToPile(v[v.length - 1]));
    //     // let test = this.findMoveForPile("pile1", this.getValidMoveToPile(v[v.length - 1]));
    //     // let test = this.findMoveForStack("pile3", this.getValidMoveToStack(v[v.length - 1]));
    //     // let test = this.findMoveForStack("stack1", this.getValidMoveToStack(v[v.length - 1]));
    //
    //     let moves = [];
    //     this.addAllMovesForStack(moves, "stack1", this.state.stack1);
    //     this.addAllMovesForStack(moves, "stack2", this.state.stack2);
    //     this.addAllMovesForStack(moves, "stack3", this.state.stack3);
    //     this.addAllMovesForStack(moves, "stack4", this.state.stack4);
    //     this.addAllMovesForPile(moves, "pile1", this.state.pile1);
    //     this.addAllMovesForPile(moves, "pile2", this.state.pile2);
    //     this.addAllMovesForPile(moves, "pile3", this.state.pile3);
    //     this.addAllMovesForPile(moves, "pile4", this.state.pile4);
    //     this.addAllMovesForPile(moves, "pile5", this.state.pile5);
    //     this.addAllMovesForPile(moves, "pile6", this.state.pile6);
    //     this.addAllMovesForPile(moves, "pile7", this.state.pile7);
    //     console.log(moves);
    // };
    //
    // addAllMovesForStack(moves, dst, dstArr) {
    //     let move = this.findMoveForStack(dst, this.getValidMoveToStack(dstArr[dstArr.length - 1]));
    //     if (move.length > 0) {
    //         moves.push(move);
    //     }
    // }
    //
    // addAllMovesForPile(moves, dst, dstArr) {
    //     let move = this.findMoveForPile(dst, this.getValidMoveToPile(dstArr[dstArr.length - 1]));
    //     if (move.length > 0) {
    //         moves.push(move);
    //     }
    // }
    //
    // getValidMoveToPile(card) {
    //     if (!card) {
    //         return {
    //             suit: ["clubs", "spades", "diamonds", "hearts"],
    //             value: "king"
    //         };
    //     }
    //
    //     if (card.value === "ace") {
    //         return null;
    //     }
    //
    //     let black = ["clubs", "spades"];
    //     let red = ["diamonds", "hearts"];
    //     let newSuit = black.includes(card.suit) ? red : black;
    //
    //     let parseValue = {
    //         jack: 11,
    //         queen: 12,
    //         king: 13
    //     }
    //     let value = isNaN(card.value) ? parseValue[card.value] - 1 : card.value - 1;
    //
    //     let createValue = {
    //         1: "ace",
    //         11: "jack",
    //         12: "queen",
    //     }
    //     let newValue = value > 10 || value === 1 ? createValue[value] : value;
    //
    //     console.log("CARD TO FIND: " + newSuit + " " + newValue);
    //
    //     return {
    //         suit: newSuit,
    //         value: newValue
    //     };
    // }
    //
    // getValidMoveToStack(card) {
    //     console.log(card);
    //     if (!card) {
    //         return {
    //             suit: ["clubs", "spades", "diamonds", "hearts"],
    //             value: "ace"
    //         };
    //     }
    //
    //     if (card.value === "king") {
    //         console.log("RETURN NULL");
    //         return null;
    //     }
    //
    //     let parseValue = {
    //         ace: 1,
    //         jack: 11,
    //         queen: 12,
    //     }
    //     let value = isNaN(card.value) ? parseValue[card.value] + 1 : +card.value + 1;
    //
    //     console.log(card.value);
    //     console.log(value);
    //
    //     let createValue = {
    //         11: "jack",
    //         12: "queen",
    //         13: "king"
    //     }
    //     let newValue = value > 10 ? createValue[value] : value;
    //
    //     console.log("CARD TO FIND: " + card.suit + " " + newValue);
    //
    //     return {
    //         suit: card.suit,
    //         value: newValue
    //     };
    // }
    //
    // findMoveForStack(pile, card) {
    //     if (!card) {
    //         return null;
    //     }
    //
    //     console.log(`IN FINDMOVEFORSTACK: ${pile} ${card.suit} ${card.value}`);
    //
    //     let moves = [];
    //     this.createSingleMove(this.state.discard, "discard", pile, card, moves);
    //     this.createSingleMove(this.state.pile1, "pile1", pile, card, moves);
    //     this.createSingleMove(this.state.pile2, "pile2", pile, card, moves);
    //     this.createSingleMove(this.state.pile3, "pile3", pile, card, moves);
    //     this.createSingleMove(this.state.pile4, "pile4", pile, card, moves);
    //     this.createSingleMove(this.state.pile5, "pile5", pile, card, moves);
    //     this.createSingleMove(this.state.pile6, "pile6", pile, card, moves);
    //     this.createSingleMove(this.state.pile7, "pile7", pile, card, moves);
    //
    //     return moves;
    // }
    //
    // findMoveForPile(pile, card) {
    //     if (!card) {
    //         return null;
    //     }
    //
    //     console.log(`IN FINDMOVEFORPILE: ${pile} ${card.suit} ${card.value}`);
    //
    //     let moves = [];
    //     this.createSingleMove(this.state.discard, "discard", pile, card, moves);
    //     this.createSingleMove(this.state.stack1, "stack1", pile, card, moves);
    //     this.createSingleMove(this.state.stack2, "stack2", pile, card, moves);
    //     this.createSingleMove(this.state.stack3, "stack3", pile, card, moves);
    //     this.createSingleMove(this.state.stack4, "stack4", pile, card, moves);
    //     this.createMoves(this.state.pile1, "pile1", pile, card, moves);
    //     this.createMoves(this.state.pile2, "pile2", pile, card, moves);
    //     this.createMoves(this.state.pile3, "pile3", pile, card, moves);
    //     this.createMoves(this.state.pile4, "pile4", pile, card, moves);
    //     this.createMoves(this.state.pile5, "pile5", pile, card, moves);
    //     this.createMoves(this.state.pile6, "pile6", pile, card, moves);
    //     this.createMoves(this.state.pile7, "pile7", pile, card, moves);
    //
    //     return moves;
    // }
    //
    // createSingleMove(srcArr, src, dst, card, moves) {
    //     if (srcArr.length < 1) {
    //         return;
    //     }
    //
    //     let curCard = srcArr[srcArr.length - 1]
    //     if (curCard.value === card.value && card.suit.includes(curCard.suit)) {
    //         moves.push({
    //             cards: [{
    //                 suit: curCard.suit, value: curCard.value
    //             }],
    //             src: src,
    //             dst: dst
    //         });
    //     }
    // }
    //
    // createMoves(srcArr, src, dst, card, moves) {
    //     if (srcArr.length < 1 || srcArr === dst) {
    //         return;
    //     }
    //
    //     for (let curCard of srcArr) {
    //         if (curCard.up && curCard.value === card.value && card.suit.includes(curCard.suit)) {
    //             moves.push({
    //                 cards: [{
    //                     suit: curCard.suit, value: curCard.value
    //                 }],
    //                 src: src,
    //                 dst: dst
    //             });
    //             break;
    //         }
    //     }
    // }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`
        }).then(data => {
            this.setState({
                pile1: data.pile1,
                pile2: data.pile2,
                pile3: data.pile3,
                pile4: data.pile4,
                pile5: data.pile5,
                pile6: data.pile6,
                pile7: data.pile7,
                stack1: data.stack1,
                stack2: data.stack2,
                stack3: data.stack3,
                stack4: data.stack4,
                draw: data.draw,
                discard: data.discard
            });
        }).fail(err => {
            // TODO: Should show a helpful error message that the game could not be found
            console.log(err);
        }).then(() => {
            console.log(this.state);
        });
    }

    escFunction(event){
        if(event.keyCode === 27) {
            this.removeHighlight();
        }
    }

    onClick(ev) {
        console.log("~~~~~~~");
        console.log("STATE.TARGET");
        console.log(this.state.target);

        let clickTarget = ev.target;
        console.log(`CLICKTARGET ID: ${clickTarget.id}`);

        console.log("CARDINFO");
        let cardInfo = this.getCardInfo(clickTarget.id);
        console.log(cardInfo);

        // Click on the draw pile
        if (cardInfo && cardInfo.pile === "draw") {
            console.log("DRAW");
            this.setState({ target: {
                card: cardInfo.card,
                pile: cardInfo.pile,
                ref: clickTarget
            }}, () =>
                this.createMove("discard")
            );

        // Click on face up card without a target selected.
        } else if (!this.state.target && cardInfo && cardInfo.up) {
            console.log("ORIGINAL CLICK");
            this.setState({ target: {
                card: cardInfo.card,
                pile: cardInfo.pile,
                ref: clickTarget
            }});
            clickTarget.classList.add("selected");

        } else if (this.state.target && cardInfo) {
            // Click on a face up card with a target selected
            if (cardInfo.up) {
                console.log("MOVE TO UP CARD");
                this.createMove(cardInfo.pile);

            // Click on a face down card with a target selected
            } else {
                console.log("CLICK ON DOWN CARD");
                this.removeHighlight();
            }

            // Click on a location with a target selected
        } else if (this.state.target) {
            console.log("MOVE TO PILE");
            this.createMove(clickTarget.id);
        }

        // Everything else
        else {
            console.log("NO ACTION");
        }
    }

    createMove(newLocation) {
        console.log(this.state.target);
        let cardsArr = [];
        let curCard = {
            suit: this.state.target.card.suit,
            value: this.state.target.card.value
        }
        cardsArr.push(curCard);

        let move = {
            cards: cardsArr,
            src: this.state.target.pile,
            dst: newLocation
        }

        console.log("MOVE");
        console.log(move);

        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`,
            method: "put",
            data: move,
        }).then(data => {
            console.log("SUCCESSFUL MOVE");
            console.log(data);
            this.removeHighlight();
            this.setState({
                pile1: data.pile1,
                pile2: data.pile2,
                pile3: data.pile3,
                pile4: data.pile4,
                pile5: data.pile5,
                pile6: data.pile6,
                pile7: data.pile7,
                stack1: data.stack1,
                stack2: data.stack2,
                stack3: data.stack3,
                stack4: data.stack4,
                draw: data.draw,
                discard: data.discard,
                target: undefined
            });
        }).fail(err => {
            console.log("ERROR");
            console.log(err.responseText);
            this.removeHighlight();
        });
    }

    removeHighlight() {
        if(this.state.target) {
            this.state.target.ref.classList.remove("selected");
            this.setState({ target: null });
        }
    }

    getCardInfo(cardId) {
        for (let key in this.state) {
            if (this.state.hasOwnProperty(key) && key !== "target" && key !== "startDrag") {
                let found = false;
                let card = null;
                for (card of this.state[key]) {
                    if (`${card.suit}:${card.value}` === cardId) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    return {
                        card: {
                            suit: card.suit,
                            value: card.value
                        },

                        pile: key,
                        up: card.up
                    };
                }
            }
        }

        return null;
    }

    render() {
        return <div>
            <div className="card-row">
                <Pile
                    pileName="stack1"
                    cards={this.state.stack1}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="stack2"
                    cards={this.state.stack2}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="stack3"
                    cards={this.state.stack3}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="stack4"
                    cards={this.state.stack4}
                    spacing={0}
                    onClick={this.onClick}
                />
                <div className="card-row-gap"/>
                <Pile
                    pileName="draw"
                    cards={this.state.draw}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="discard"
                    cards={this.state.discard}
                    spacing={0}
                    onClick={this.onClick}
                />
            </div>
            <div className="card-row">
                <Pile pileName="pile1" cards={this.state.pile1} onClick={this.onClick}/>
                <Pile pileName="pile2" cards={this.state.pile2} onClick={this.onClick}/>
                <Pile pileName="pile3" cards={this.state.pile3} onClick={this.onClick}/>
                <Pile pileName="pile4" cards={this.state.pile4} onClick={this.onClick}/>
                <Pile pileName="pile5" cards={this.state.pile5} onClick={this.onClick}/>
                <Pile pileName="pile6" cards={this.state.pile6} onClick={this.onClick}/>
                <Pile pileName="pile7" cards={this.state.pile7} onClick={this.onClick}/>
            </div>
        </div>
    }
}

export default withRouter(Game);
