"use strict";

let Joi             = require('joi'),
    _               = require('underscore');


module.exports = app => {

    // GET point to get all home ids from our database.
    app.get('/homes', (req, res) => {
        console.log("~~~GET HOMES~~~");
        app.models.water.influx.query(`SHOW TAG VALUES FROM water WITH KEY IN ("home_id")`)
            .then(results => res.status(200).send(results),
                err => res.status(400).send({error: err}));
    });
};