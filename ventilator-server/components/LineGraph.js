import React, { Component } from 'react'
import Chart from 'chart.js'
import moment from 'moment'

export default class LineGraph extends Component {
    chartRef = React.createRef()

    componentDidMount() {
        const ctx = this.chartRef.current.getContext("2d")

        this.chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "ExpiredCO2",
                    data: []
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                second: 'h:mm:ss a'
                            }
                        },
                        ticks:{
                            maxTicksLimit: 5
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 6
                        }
                    }]
                }
            }
        })

        this.props.socket.on('data', (data) => {
            var time = moment.unix(data.ventdata.time)
            this.chart.data.labels.push(time)
            this.chart.data.datasets[0].data.push(data.ventdata.processed.ExpiredCO2)
            var minTime = moment(time).subtract(35, 's')

            console.log(`Inserting timestamp ${time}, minTime ${minTime}`)
            
            // remove old values
            while (this.chart.data.labels.length > 0) {
                if (this.chart.data.labels[0].isBefore(minTime)) {
                    console.log(`Removing timestamp ${this.chart.data.labels[0]}`)
                    this.chart.data.labels.shift()
                    this.chart.data.datasets[0].data.shift()
                } else {
                    break
                }
            }

            minTime.add(5,'s')
            this.chart.options.scales.xAxes[0].ticks.min = minTime
            this.chart.options.scales.xAxes[0].ticks.max = time
            this.chart.update()
        })
    }

    render() {
        return (
            <div style={{width: '75%'}}>
                <canvas id="canvas" ref={this.chartRef}></canvas>
            </div>
        )
    }
}