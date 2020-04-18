import React from 'react'
import LineGraph from './LineGraph'
import moment from 'moment'

const CHART_WINDOW_SECONDS = 20

export default class GraphView extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        flowrateLabels: [],
        flowrateData: [],
        heartRateLabels: [],
        heartRateData: [],
        oxygenSaturationLabels: [],
        oxygenSaturationData: [],
        xmin: 0,
        xmax: 0
    }

    getFlowrate(data) {
        return {
            time: moment.unix(data.ventdata.time),
            value: data.ventdata.processed.flowrate
        }
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

    render() {
        return(
            <div className="graphContainer">
                <LineGraph activeVentilator={this.props.activeVentilator} socket={this.props.socket} callback={this.getFlowrate} label="Flowrate" window={CHART_WINDOW_SECONDS} xmin={this.state.xmin} xmax={this.state.xmax} ymin={-30000} ymax={50000} frozen={this.props.frozen}/>
                <LineGraph activeVentilator={this.props.activeVentilator} socket={this.props.socket} callback={this.getHeartRate} label="Heart Rate" window={CHART_WINDOW_SECONDS} xmin={this.state.xmin} xmax={this.state.xmax} ymin={60} ymax={100} frozen={this.props.frozen}/>
                <LineGraph activeVentilator={this.props.activeVentilator} socket={this.props.socket} callback={this.getOxygenSaturation} label="Oxygen Saturation" window={CHART_WINDOW_SECONDS} xmin={this.state.xmin} xmax={this.state.xmax} ymin={80} ymax={100} frozen={this.props.frozen}/>
            </div>
        );
    }

}
