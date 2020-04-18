import React from 'react'
import LineGraph from './LineGraph'
import moment from 'moment'

const CHART_WINDOW_SECONDS = 30

export default class GraphView extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        heartRateLabels: [],
        heartRateData: [],
        oxygenSaturationLabels: [],
        oxygenSaturationData: [],
        xmin: 0,
        xmax: 0
    }

    getHeartRate(data) {
        return {
            time: moment.unix(data.ventdata.time),
            value: data.vitalsigns.heartRate
        }
    }
    
    getOxygenSaturation(data) {
        return {
            time: moment.unix(data.ventdata.time),
            value: data.vitalsigns.oxygenSaturation
        }
    }

    lastTime = moment.unix(0)

    // componentDidMount() {
    //     this.props.socket.on('data', (data) => {
    //         var time = moment.unix(data.ventdata.time)

    //         // Enforce monotonic time
    //         if (time.isSameOrBefore(this.lastTime)) {
    //             console.log("Skipped duplicate/nonmonotonic timestamp")
    //             return
    //         }

    //         this.setState(state => {
    //             // Append new value, remove old ones
    //             //const hrData = this.state.heartRateData.concat({time: time, value: data.vitalsigns.heartRate})//.filter(d => d.time.isSameOrAfter(minTime))
    //             //const o2Data = this.state.oxygenSaturationData.concat({time: time, value: data.vitalsigns.oxygenSaturation})//.filter(d => d.time.isSameOrAfter(minTime))

    //             this.state.heartRateLabels

                
    //             var minTime = moment(time).subtract(CHART_WINDOW_SECONDS + 1,'s');
    //             while (hrData[0].time.isBefore(minTime)) hrData.shift()
    //             while (o2Data[0].time.isBefore(minTime)) o2Data.shift()

    //             // Set x-Axis scale
    //             minTime.add(1,'s')
    //             this.setState({xmin: minTime, xmax: time})

    //             return {
    //                 heartRateData: hrData,
    //                 oxygenSaturationData: o2Data
    //             }
    //         })

    //         this.lastTime = time
    //     })
    // }

    render() {
        return(
            <div className="graphContainer">
                <LineGraph socket={this.props.socket} callback={this.getHeartRate} label="Heart Rate" window={CHART_WINDOW_SECONDS} xmin={this.state.xmin} xmax={this.state.xmax} ymin={60} ymax={100}/>
                <LineGraph socket={this.props.socket} callback={this.getOxygenSaturation} label="Oxygen Saturation" window={CHART_WINDOW_SECONDS} xmin={this.state.xmin} xmax={this.state.xmax} ymin={80} ymax={100}/>
            </div>
        );
    }

}
