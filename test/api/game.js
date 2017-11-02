/* Copyright G. Hemingway, 2017 - All rights reserved */
"use strict";

let should          = require('should'),
    assert          = require('assert'),
    request         = require('superagent'),
    harness         = require('./harness'),
    data            = require('./data'),
    config = data.config,
    users = data.users,
    games = data.games;

/**************************************************************************/

describe('Game:', () => {
    let primaryAgent = request.agent(),
        anonAgent = request.agent();
    before(done => {
        harness.setup(config.mongoURL, () => {
            // Create a user for game testing
            harness.createUser(config.url, users.primary, () => {
                // Log in the user with primaryAgent
                harness.login(config.url, primaryAgent, users.primary, () => {
                    done();
                });
            });
        });
    });
    after(done => {
        // Log out the primary agent
        harness.logout(config.url, primaryAgent, () => {
            harness.shutdown(done);
        });
    });
});