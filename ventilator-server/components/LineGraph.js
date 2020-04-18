import React, { Component } from 'react'
import Chart from 'chart.js'
import moment from 'moment'

export default class LineGraph extends Component {
    chartRef = React.createRef()
    currentVent = null
    ventData = []

    wasFrozen = false

    constructor(props) {
        super(props)

        this.updateSizes = this.updateSizes.bind(this);
        this.handleLoad = this.handleLoad.bind(this);
    }

    updateSizes() {
        this.chart.canvas.parentNode.style.height = ((window.innerHeight * 0.35) - 80) + 'px';
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
                legend: {
                    labels: {
                        boxWidth: 0,
                        fontSize: 18
                    },
                    onClick: null
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                second: 'H:mm:ss'
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
                            suggestedMax: this.props.ymax,
                            callback: (value, index, values) => {
                                return (Math.abs(value) > 1000) ? (value/1000) + 'k' : value;
                            }
                        }
                    }]
                },
                maintainAspectRatio: false
            }
        })

        this.props.socket.on('data', (data) => {
            // Store data for all ventilators
            var index = this.ventData.findIndex(d => d.device_id === data.ventdata.device_id)
            if (index === -1) {
                // New ventilator
                this.ventData.push({
                    device_id: data.ventdata.device_id,
                    data: [data]
                })
            } else {
                // Existing ventilator - enforce monotonic time
                var myVentData = this.ventData[index].data
                var myTime = moment.unix(data.ventdata.time)
                if (moment.unix(myVentData[myVentData.length - 1].ventdata.time).isSameOrAfter(myTime))
                    return

                // Push new data
                this.ventData[index].data.push(data)
                var time = moment.unix(data.ventdata.time)

                // Remove old data
                var minTime = moment(time).subtract(this.props.window + 5, 's')
                var lenBefore = myVentData.length
                while(moment.unix(myVentData[0].ventdata.time).isBefore(minTime)) myVentData.shift()
            }

            // Only proceed for active ventilator and when not frozen
            if (data.ventdata.device_id !== this.props.activeVentilator)
                return

            var elem = this.props.callback(data)

            this.chart.data.labels.push(elem.time)
            this.chart.data.datasets[0].data.push(elem.value)

            var minTime = moment(elem.time).subtract(this.props.window + 5, 's')
            while(this.chart.data.labels[0].isBefore(minTime)) {
                this.chart.data.labels.shift()
                this.chart.data.datasets[0].data.shift()
            }

            minTime.add(5,'s')
            this.chart.options.scales.xAxes[0].ticks.min = minTime
            this.chart.options.scales.xAxes[0].ticks.max = elem.time

            if(!this.props.frozen) {
                this.chart.update()
            }
        })
    }

    componentDidUpdate() {
        if (this.props.activeVentilator !== this.currentVent) {
            // Ventilator changed - clear graph
            this.chart.data.labels = []
            this.chart.data.datasets[0].data = []
            // If no ventilator is active, leave graph empty
            if (this.props.activeVentilator == -1)
                return

            // Load data from new ventilator
            var index = this.ventData.findIndex(d => d.device_id === this.props.activeVentilator)
            if (index !== -1) {
                var data = this.ventData[index].data
                data.forEach(element => {
                    var elem = this.props.callback(element)
                    this.chart.data.labels.push(elem.time)
                    this.chart.data.datasets[0].data.push(elem.value)
                })

                var lastTime = moment.unix(data[data.length - 1].ventdata.time)
                var minTime = moment(lastTime).subtract(this.props.window, 's')
                this.chart.options.scales.xAxes[0].ticks.min = minTime
                this.chart.options.scales.xAxes[0].ticks.max = lastTime
            }

            this.chart.update(0)
            this.currentVent = this.props.activeVentilator
        }

        if(this.wasFrozen !== this.props.frozen) {
            if(!this.props.frozen) {
                //Update graph
                this.chart.update()
            }
        }
        this.wasFrozen = this.props.frozen;
    }

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
