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

        this.escFunction     = this.escFunction.bind(this);
        this.onClick         = this.onClick.bind(this);
        this.createMove      = this.createMove.bind(this);
        this.removeHighlight = this.removeHighlight.bind(this);
        this.getCardInfo     = this.getCardInfo.bind(this);

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
            && (cardInfo.card.value != topDiscard.value || cardInfo.card.suit != topDiscard.suit)) {
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
                console.log(this.state.draw);
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
                && curCard.value == this.state.target.card.value) {
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

        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`,
            method: "put",
            data: move,
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

    render() {
        return <div>
            <div onClick={this.removeHighlight} style={this.fullScreenStyle} />
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
