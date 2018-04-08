"use strict";

let Joi             = require('joi'),
    _               = require('underscore');


module.exports = app => {

    app.post('/utilities/water', (req, res) => {
        console.log("~~~POST WATER~~~");
        if (!req.body || !req.body.timestamp || !req.body.tags || !req.body.fields) {
            res.status(404).send({error: 'no data'});
        } else {
            req.body.measurement = app.models.water.measurement;
            req.body.timestamp = new Date(req.body.timestamp);  // influx library doesn't handle date strings well
            app.models.water.influx.writePoints([req.body])
                .then(() => res.status(200).send(),
                    err => res.status(400).send({error: err}));
        }
    });

    app.get('/utilities/water/:home_id', (req, res) => {
        console.log(`~~~GET WATER FOR ${req.params.home_id}~~~`);
        app.models.water.influx.query(`SELECT * FROM ${app.models.water.measurement} WHERE home_id = '${req.params.home_id}'`)
            .then(results => res.status(200).send(results),
                err => res.status(400).send({error: err}));
    });
};