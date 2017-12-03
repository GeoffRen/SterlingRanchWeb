/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let Joi             = require('joi'),
    _               = require('underscore'),
    Solitare        = require('../../solitare');


module.exports = app => {

    // Create a new game
    app.post('/v1/game', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ error: 'unauthorized' });
        } else {
            // Schema for user info validation
            let schema = Joi.object().keys({
                game: Joi.string().lowercase().required(),
                color: Joi.string().lowercase().required(),
                draw: Joi.any()
            });
            // Validate user input
            Joi.validate(req.body, schema, {stripUnknown: true}, (err, data) => {
                if (err) {
                    const message = err.details[0].message;
                    res.status(400).send({error: message});
                } else {
                    // Set up the new game
                    let newGame = {
                        owner:          req.session.user.username,
                        active:         true,
                        cards_remaining: 52,
                        color:          data.color,
                        game:           data.game,
                        score:          0,
                        start:          Date.now(),
                        winner:         "",
                        moves:          [],
                        state:          []
                    };
                    switch(data.draw) {
                        case 'Draw 1': newGame.drawCount = 1; break;
                        case 'Draw 3': newGame.drawCount = 3; break;
                    }
                    // Generate a new initial game state
                    newGame.state.push(Solitare.initialState());
                    let game = new app.models.Game(newGame);
                    game.save(err => {
                        if (err) {
                            res.status(400).send({ error: 'failure creating game' });
                            // TODO: Much more error management needs to happen here
                        } else {
                            const query = { $push: { games: game._id }};
                            // Save game to user's document too
                            app.models.User.findOneAndUpdate({ _id: req.session.user._id }, query, () => {
                                res.status(201).send({
                                    id: game._id
                                });
                            });
                        }
                    });
                }
            });
        }
    });

    // Fetch game information
    app.get('/v1/game/:id', (req, res) => {
       if (!req.session.user) {
           res.status(401).send({ error: 'unauthorized' });
       } else {
           app.models.Game.findById(req.params.id)
               .then(
                   game => {
                       if (!game) {
                           res.status(404).send({error: `unknown game: ${req.params.id}`});
                       } else {
                           let gameIdx = req.query.moveid ? req.query.moveid : game.state.length - 1;
                           const state = game.state[gameIdx].toJSON();
                           let results = _.pick(game.toJSON(), 'start', 'moves', 'winner', 'score', 'drawCount', 'color', 'active', 'owner');
                           results.start = Date.parse(results.start);
                           results.cards_remaining = 52 - (state.stack1.length + state.stack2.length + state.stack3.length + state.stack4.length);
                           res.status(200).send(_.extend(results, state));
                       }
                   }, err => {
                       res.status(404).send({error: `unknown game: ${req.params.id}`});
                   }
               );
       }
    });

    app.put('/v1/game/:id', (req, res) => {
        if (!req.session.user) {
            res.status(401).send({ error: 'not logged in' });
        } else if (req.session.user.username !== req.body.owner) {
            res.status(401).send({ error: 'unauthorized' });
        } else if (!req.body || !req.body.move || !req.body.state) {
            res.status(404).send({ error: 'no data' });
        } else {

            let state = req.body.state;
            // jQuery automatically prunes empty values which breaks Solitare.validateMove.
            let piles = ["stack1", "stack2", "stack3", "stack4", "pile1", "pile2", "pile3", "pile4","pile5", "pile6", "pile7", "discard", "draw"];
            for (let pile of piles) {
                if (!state[pile]) {
                    state[pile] = [];
                }
            }

            let move = Solitare.validateMove(state, req.body.move);
            if (move.error) {
                res.status(404).send({ error: 'invalid move' });
            } else {
                let updates = updateState(state, move, req.session.user.username)
                app.models.Game.findByIdAndUpdate(req.params.id, { $push: updates }, { new: true } , (err, newState) => {
                    if (err) {
                        res.status(400).send({ error: 'failure updating game' });
                    } else {
                        res.status(201).send(newState.state[newState.state.length - 1]);
                    }
                });
            }
        }
    });

    // Updates the game state.
    let updateState = (game, move, user) => {
        let newState = JSON.parse(JSON.stringify(game));
        let curSrc = newState[move.src];
        let cardAmount = move.cards.length;
        curSrc.splice(curSrc.length - cardAmount, cardAmount);

        if (curSrc.length > 0 && move.src !== "draw") {
            curSrc[curSrc.length - 1].up = true;
        }

        let curDst = newState[move.dst];
        let up = move.dst !== "draw";
        for (let card of move.cards) {
            curDst.push({
                suit: card.suit,
                value: card.value,
                up: up
            });
        }

        let newMove = {
            move: move,
            date: Date.now(),
            player: user
        };

        return {
            state: newState,
            moves: newMove
        }
    }

    // Provide end-point to request shuffled deck of cards and initial state - for testing
    app.get('/v1/cards/shuffle', (req, res) => {
        res.send(Solitare.shuffleCards(false));
    });
    app.get('/v1/cards/initial', (req, res) => {
        res.send(Solitare.initialState());
    });

};
