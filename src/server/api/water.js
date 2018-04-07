"use strict";

let Joi             = require('joi'),
    _               = require('underscore');


module.exports = app => {

    app.post('/utilities/water', (req, res) => {
        console.log("~~~POST~~~");
        if (!req.body || !req.body.timestamp || !req.body.tags || !req.body.fields) {
            res.status(404).send({error: 'no data'});
        } else {
            req.body.measurement = app.models.water.measurement;
            req.body.timestamp = new Date(req.body.timestamp);  // influx library doesn't handle date strings well
            console.log(req.body);
            app.models.water.influx.writePoints([req.body])
                .then(() => res.status(200).send(),
                    err => res.status(400).send({error: err}));
        }
    });

    app.get('/utilities/water/', (req, res) => {
        console.log("~~~GET~~~");
        app.models.water.influx.query(`select * from ${app.models.water.measurement}`)
            .then(results => res.status(200).send(results),
                err => res.status(400).send({error: err}));
    });
};