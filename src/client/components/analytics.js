'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router';
const Influx = require('influx');
const chart = require('chart.js');

class Analytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "JUST IN PLACE FOR NOW"
        };
    }

    componentDidMount() {
        $.ajax({
            url: '/utilities/water/',
        }).then(results => {
            console.log(results);
            let xAxis = [];
            let data = [];
            console.log('Processing');
            results.forEach(result => {
                xAxis.push(result.time);
                data.push(result.data);
                console.log(result);
            });
            // console.log(xAxis + data);
            console.log('Done');
            let ctx = document.getElementById("myChart").getContext('2d');
            let myChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: xAxis,
                datasets: [{
                  label: 'Relative Humidity',
                  data: data,
                  backgroundColor: "rgba(153,255,51,0.4)"
                }]
              }
            });
        }).catch(err => {
            return 'ERROR';
        });
    }

    render() {
        return <div>
            <p>This is a chart</p>
            <canvas id="myChart" width="400" height="400" style={{width: 800, height: 450}}></canvas>
        </div>
    };
}

export default withRouter(Analytics);