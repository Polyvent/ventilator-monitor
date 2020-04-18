import React, { Component } from 'react'
import Chart from 'chart.js'
import moment from 'moment'

export default class LineGraph extends Component {
    chartRef = React.createRef()

    constructor(props) {
        super(props)

        this.updateSizes = this.updateSizes.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    updateSizes() {
        this.chart.canvas.parentNode.style.height = ((window.innerHeight * 0.5) - 80) + 'px';
        this.chart.canvas.parentNode.style.width = (window.innerWidth - 220) + 'px';
    }

    handleLoad() {
        this.updateSizes();
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateSizes);
        window.addEventListener('load', this.handleLoad);


        const ctx = this.chartRef.current.getContext("2d")

        this.chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: this.props.labels,
                datasets: [{
                    label: this.props.label,
                    data: this.props.data
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
                            min: this.props.xmin,
                            max: this.props.xmax,
                            maxTicksLimit: 5,
                            maxRotation: 0
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            suggestedMin: this.props.ymin,
                            suggestedMax: this.props.ymax
                        }
                    }]
                },
                maintainAspectRatio: false
            }
        })

        this.props.socket.on('data', (data) => {
            var elem = this.props.callback(data)
            // Enforce monotonic time
            var lastLabel = this.chart.data.labels[this.chart.data.labels.length - 1]
            if (this.chart.data.labels.length > 0 && elem.time.isSameOrBefore(lastLabel)) {
                //console.log("Ignored duplicate/nonmonotonic timestamp: elem.time: ", elem.time, " lasttime: ", lastLabel)
                return
            }

            this.chart.data.labels.push(elem.time)
            this.chart.data.datasets[0].data.push(elem.value)

            var minTime = moment(elem.time).subtract(this.props.window, 's')
            console.log("elem.time: ", elem.time, " minTime: ", minTime)
            while(this.chart.data.labels[0].isBefore(minTime)) {
                this.chart.data.labels.shift()
                this.chart.data.datasets[0].data.shift()
            }

            minTime.add(5,'s')
            this.chart.options.scales.xAxes[0].ticks.min = minTime
            this.chart.options.scales.xAxes[0].ticks.max = elem.time

            this.chart.update()
        })
    }

    // componentDidUpdate() {
    //     // this.chart.data.labels = this.props.data.map(d => d.time)
    //     // this.chart.data.datasets[0].data = this.props.data.map(d => d.value)
    //     this.chart.options.scales.xAxes[0].ticks.min = this.props.xmin
    //     this.chart.options.scales.xAxes[0].ticks.max = this.props.xmax
    //     this.chart.options.scales.yAxes[0].ticks.suggestedMin = this.props.ymin
    //     this.chart.options.scales.yAxes[0].ticks.suggestedMax = this.props.ymax
    //     this.chart.update()
    // }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateSizes);
        window.removeEventListener('load', this.handleLoad);
    }


    render() {
        return (
            <div className="graph-view">
                <canvas className="graph-canvas" id="canvas" ref={this.chartRef}></canvas>
            </div>
        )
    }
}
