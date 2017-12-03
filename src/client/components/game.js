/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';

let _                           = require('underscore');

import React, { Component }     from 'react';
import { withRouter }           from 'react-router';

/*************************************************************************/

import { Pile } from './pile';
import { getValidMoveToStack } from '../../server/solitare';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target: undefined,
            startDrag: { x: 0, y: 0 },
            drawCount: 1,
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

        this.escFunction       = this.escFunction.bind(this);
        this.onClick           = this.onClick.bind(this);
        this.createMove        = this.createMove.bind(this);
        this.removeHighlight   = this.removeHighlight.bind(this);
        this.getCardInfo       = this.getCardInfo.bind(this);
        this.autoComplete      = this.autoComplete.bind(this);
        this.autoCompleteRound = this.autoCompleteRound.bind(this);
        this.executeMove       = this.executeMove.bind(this);

        this.fullScreenStyle = {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: "100%",
            width: "100%"
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`
        }).then(data => {
            this.setState({
                drawCount: data.drawCount,
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
        });
    }

    escFunction(event){
        if(event.keyCode === 27) {
            this.removeHighlight();
        }
    }

    onClick(ev) {
        let clickTarget = ev.target;
        let cardInfo = this.getCardInfo(clickTarget.id);

        // Click on a card in the discard that isn't the top during a three draw game.
        let topDiscard = this.state.discard[this.state.discard.length - 1];
        if (this.state.drawCount === 3 && cardInfo && cardInfo.pile === "discard"
            && (cardInfo.card.value !== topDiscard.value || cardInfo.card.suit !== topDiscard.suit)) {
            this.removeHighlight();

            // Click on the draw pile
        } else if (cardInfo && cardInfo.pile === "draw") {
            let drawCard = cardInfo.card;
            if (this.state.drawCount === 3) {
                let drawLen = this.state.draw.length;
                drawCard = drawLen > 3 ? this.state.draw[drawLen - 3] : this.state.draw[0];
            }

            this.removeHighlight();
            this.setState({
                    target: {
                        card: drawCard,
                        pile: cardInfo.pile,
                        ref: clickTarget
                    }
                }, () =>
                    this.createMove("discard")
            );

        // Click on the empty draw pile with cards in the discard pile
        } else if (clickTarget.id === "draw" && this.state.draw.length === 0 && this.state.discard.length > 0) {
            this.removeHighlight();
            this.setState({
                target: {
                    card: this.state.discard[0],
                    pile: "discard"
                }
            }, () => {
                this.createMove("draw");
            });

        // Click on face up card without a target selected.
        } else if (!this.state.target && cardInfo && cardInfo.up) {
            this.setState({
                target: {
                    card: cardInfo.card,
                    pile: cardInfo.pile,
                    ref: clickTarget
                }
            });
            clickTarget.classList.add("selected");

        } else if (this.state.target && cardInfo) {
            // Click on a face up card with a target selected
            if (cardInfo.up) {
                this.createMove(cardInfo.pile);

            // Click on a face down card with a target selected
            } else {
                this.removeHighlight();
            }

            // Click on a location with a target selected
        } else if (this.state.target) {
            this.createMove(clickTarget.id);
        }
    }

    createMove(newLocation) {
        let cardsArr = [];
        let found = false;
        for (let curCard of this.state[this.state.target.pile]) {
            if (!found && curCard.suit === this.state.target.card.suit
                && curCard.value === this.state.target.card.value) {
                found = true;
                cardsArr.push({
                    suit: curCard.suit,
                    value: curCard.value
                });
            } else if (found) {
                cardsArr.push({
                    suit: curCard.suit,
                    value: curCard.value
                });
            }
        }

        let move = {
            cards: cardsArr,
            src: this.state.target.pile,
            dst: newLocation
        }
        console.log(move);

        let data = {
            move: move,
            state: {
                pile1: this.state.pile1,
                pile2: this.state.pile2,
                pile3: this.state.pile3,
                pile4: this.state.pile4,
                pile5: this.state.pile5,
                pile6: this.state.pile6,
                pile7: this.state.pile7,
                stack1: this.state.stack1,
                stack2: this.state.stack2,
                stack3: this.state.stack3,
                stack4: this.state.stack4,
                draw: this.state.draw,
                discard: this.state.discard
            }
        }

        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`,
            method: "put",
            data: data,
        }).then(data => {
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
            console.log(err.responseText);
            this.removeHighlight();
        });
    }

    removeHighlight() {
        if(this.state.target && this.state.target.ref) {
            this.state.target.ref.classList.remove("selected");
            this.setState({ target: null });
        }
    }

    getCardInfo(cardId) {
        for (let key in this.state) {
            if (this.state.hasOwnProperty(key) && key !== "target" && key !== "startDrag" && key !== "drawCount") {
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

    // Finds and executes all moves from the piles to the stacks.
    autoComplete() {
        let moves = this.autoCompleteRound();
        console.log(moves);
        if (moves.length > 0) {
            this.executeMove(moves, 0);
        }
    }

    executeMove(moves, moveIdx) {
        let data = {
            move: moves[moveIdx],
            state: {
                pile1: this.state.pile1,
                pile2: this.state.pile2,
                pile3: this.state.pile3,
                pile4: this.state.pile4,
                pile5: this.state.pile5,
                pile6: this.state.pile6,
                pile7: this.state.pile7,
                stack1: this.state.stack1,
                stack2: this.state.stack2,
                stack3: this.state.stack3,
                stack4: this.state.stack4,
                draw: this.state.draw,
                discard: this.state.discard
            }
        }

        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`,
            method: "put",
            data: data,
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
                discard: data.discard,
                target: undefined
            }, () => {
                moveIdx++;
                if (moveIdx < moves.length) {
                    this.executeMove(moves, moveIdx);
                } else {
                    console.log("COMPLETED A ROUND");
                    this.autoComplete();
                }
            });
        }).fail(err => {
            console.log(err.responseText);
        });
    }

    // Finds all the moves from a pile to a stack for the current state.
    autoCompleteRound() {
        let completableCards = {};
        let stacks = ["stack1", "stack2", "stack3", "stack4"];
        stacks.forEach(stackName => {
            let stack = this.state[stackName];
            let topStack = stack[stack.length - 1];
            if (stack.length > 0 && topStack.value !== "king") {
                let card = getValidMoveToStack(topStack);
                card["up"] = true;
                completableCards[stackName] = card;
            }
        });

        let moves = [];
        let piles = ["pile1", "pile2", "pile3", "pile4", "pile5", "pile6", "pile7"];
        piles.forEach(pileName => {
            let pile = this.state[pileName];
            let topPile = pile[pile.length - 1];
            if (pile.length > 0) {
                if (topPile.value === "ace") {
                    for (let stackName of stacks) {
                        if (!completableCards[stackName]) {
                            // So two aces aren't placed on the same stack.
                            completableCards[stackName] = "EXISTS";
                            moves.push({
                                cards: [{
                                    suit: topPile.suit,
                                    value: topPile.value
                                }],
                                src: pileName,
                                dst: stackName
                            });
                            break;
                        }
                    }
                } else {
                    for (let stackName in completableCards) {
                        if (!completableCards.hasOwnProperty(stackName)) {
                            continue;
                        }
                        if (_.isEqual(completableCards[stackName], topPile)) {
                            moves.push({
                                cards: [{
                                    suit: topPile.suit,
                                    value: topPile.value
                                }],
                                src: pileName,
                                dst: stackName
                            });
                        }
                    }
                }
            }
        });

        return moves;
    }

    render() {
        return <div>
            <div onClick={this.removeHighlight} style={this.fullScreenStyle} />
            <div className="col-sm-4" style={{position: "relative"}}>
                <button className="btn btn-default" onClick={this.autoComplete}>End The Game</button>
            </div>
            <div className="col-sm-4 card-buttons">
                <button className="btn btn-default" onClick={this.autoComplete}>Auto Complete</button>
            </div>
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
                    spacing={this.state.drawCount > 1 ? 10 : 0}
                    onClick={this.onClick}
                    horizontal={this.state.drawCount > 1}
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
