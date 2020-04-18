import React from 'react';

import GraphView from './GraphView';
import VentilatorInfo from './VentilatorInfo';
import SideCategory from './SideCategory';


export default class VentilatorList extends React.Component {
    state = {
        data: {}
    }

    constructor(props) {
        super(props)
    }

    showSide(data) {
        return {
            triggerSettings: {
                VT: data.ventdata.processed.triggerSettings.VT,
                PEEP: data.ventdata.processed.triggerSettings.PEEP,
                FiO2: data.ventdata.processed.triggerSettings.FiO2,
                MVe: data.ventdata.processed.triggerSettings.MVe,
                RR: data.ventdata.processed.triggerSettings.RR,
                RH: data.ventdata.processed.triggerSettings.humidity,
                P: data.ventdata.processed.triggerSettings.pressure_max,
            },
            vitalsigns: {
                SBP: data.vitalsigns.bloodpressure.systole,
                DBP: data.vitalsigns.bloodpressure.diastole,
                Temp: data.vitalsigns.bodyTemperature,
                Pulse: data.vitalsigns.heartRate,
                SaO2: data.vitalsigns.oxygenSaturation
            }
        }
    }

    componentDidMount() {
        this.props.socket.on('data', (data) => {
            this.setState({data: this.showSide(data)})
        })
    }

    render() {
        return(
            <div>
                <div>
                    <GraphView socket={this.props.socket} activeVentilator={this.props.activeVentilator} frozen={this.props.frozen}/>
                </div>

                <div className="side-info">
                    <SideCategory data={this.state.data.triggerSettings} name="Trigger Settings"/>
                    <SideCategory data={this.state.data.vitalsigns} name="Vital Signs"/>
                </div>

            </div>
        );
    }

}
