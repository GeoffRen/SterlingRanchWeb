'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router';
const Influx = require('influx');
const chart = require('chart.js');

class Analytics extends Component {
    constructor(props) {
        super(props);
        this.createChart = this.createChart.bind(this);
        this.createBarChart = this.createBarChart.bind(this);
        this.createLineChart = this.createLineChart.bind(this);
        this.test = this.test.bind(this);
        this.lineClick = this.lineClick.bind(this);
        this.state = { chart: undefined };
    }

    test() {
        console.log("TEST");
    }

    componentDidMount() {
        let home_id = this.props.match.params.home_id;
        console.log(home_id);
        $.ajax({
            url: `/utilities/water/${home_id}`
        }).then(results => {
            let xAxis = [];
            let data = [];
            let i = 0;
            results.forEach(result => {
                xAxis.push(i++);
                data.push(result.data);
            });
            let ctx = document.getElementById("myChart").getContext('2d');
            this.createChart(xAxis, data, ctx);
            this.createBarChart();
            this.createLineChart()
        }).catch(err => {
            return 'ERROR';
        });
    }

    createChart(xAxis, data, ctx) {
        let myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xAxis.splice(300),
                datasets: [{
                    label: 'Water Used',
                    data: data.splice(300),
                    backgroundColor: "rgba(153,255,51,0.4)"
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: 'Sample Shower Usages'
                }
            }
        });
        this.setState({ chart: myChart });
    }

    createBarChart() {
        let barChart = document.getElementById("barChart")
        let myBar = new Chart(barChart, {
            type: 'bar',
            data: {
                labels: ["January 2018", "February 2018", "March 2018", "April 2018"],
                datasets: [
                    {
                        label: "Me",
                        // backgroundColor: "blue",
                        data: [70, 88, 58, 102, 99]
                    },
                    {
                        label: "Everyone Else",
                        // backgroundColor: "red",
                        data: [100, 97, 88, 94, 92]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Sample Water Usage Comparisons'
                }
            }
        });
    }

    createLineChart() {
        let lineChart = document.getElementById("lineChart");
        let myLine = new Chart(lineChart, {
            type: 'line',
            data: {
                labels: ["1:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm", "4:00 pm", "4:30 pm", "5:00 pm", "5:30 pm"],
                datasets: [{
                    data: [0, 3, 0, 4, 12, 0, 0, 0, 4, 3],
                    label: "Kitchen",
                    borderColor: "#3e95cd",
                    fill: false
                }, {
                    data: [25, 10, 0, 0, 0, 0, 0, 0, 0, 0],
                    label: "Outside",
                    borderColor: "#8e5ea2",
                    fill: false
                }, {
                    data: [1, 3, 5, 1, 0, 23, 1, 3, 2, 0],
                    label: "Master Bathroom",
                    borderColor: "#3cba9f",
                    fill: false
                }, {
                    data: [0, 0, 0, 1, 3, 2, 5, 0, 0, 22],
                    label: "Guest Bathroom",
                    borderColor: "#e8c3b9",
                    fill: false
                }, {
                    data: [0, 0, 0, 0, 11, 15, 15, 15, 13, 0],
                    label: "Laundry Room",
                    borderColor: "#c45850",
                    fill: false
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Sample Water Usage By Room'
                },
                events: ['click', 'mousemove']
            }
            });
        lineChart.onclick = evt => {
            let activePoints = myLine.getElementsAtEvent(evt);
            if (activePoints.length > 0) {
                let mouse_position = Chart.helpers.getRelativePosition(evt, myLine.chart);
                activePoints = activePoints.filter(activePoint => {
                    let leftX = activePoint._model.x - 5,
                        rightX = activePoint._model.x + 5,
                        topY = activePoint._model.y + 5,
                        bottomY = activePoint._model.y - 5;

                    return mouse_position.x >= leftX && mouse_position.x <= rightX
                        && mouse_position.y >= bottomY && mouse_position.y <= topY;
                });
                this.lineClick(activePoints[0]._datasetIndex);
            }
        };
    }

    lineClick(idx) {
        console.log("CLICKED " + idx);
        let ctx = document.getElementById("myChart").getContext('2d');
                for (let i = 0; i < 173; i++)
        {
            this.state.chart.data.datasets[0].data[i] = 0;
        }
        for (let i = 0; i < Math.random() * 173; i++)
        {
            let indexToUpdate = Math.round(Math.random() * 173);
            this.state.chart.data.datasets[0].data[indexToUpdate] = Math.random() * 50;
        }
        let locRef = ["Kitchen", "Outside", "Master Bathroom", "Guest Bathroom", "Laundry Room"];
        this.state.chart.options.title.text = "Sample " + locRef[idx] + " Usages";
        this.state.chart.update();
    }

    render() {
        return <div>
            <h1 className={"col-sm-12 page-header header"}>Super Basic Example Dashboard</h1>
            <div>
                <div className={"col-sm-12 wrapper"} id={"line"}>
                    <canvas className={"chart"} id={"lineChart"}></canvas>
                </div>
            </div>
            <div>
                <div className={"col-sm-6 wrapper"} id={"chart"}>
                    <canvas className={"chart"} id={"myChart"}></canvas>
                </div>
                <div className={"col-sm-6 wrapper"} id={"bar"}>
                    <canvas className={"chart"} id={"barChart"}></canvas>
                </div>
            </div>
        </div>
    };
}

export default withRouter(Analytics);