import React from 'react';

import GraphView from './GraphView';
import VentilatorInfo from './VentilatorInfo';
import SideCategory from './SideCategory';


export default class VentilatorList extends React.Component {
    state = {
        data: {
            triggerSettings: {},
            vitalsigns: {}
        }
    }

    currentVent = -1
    currentStatus = ''
    sideData = []

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
            // Store data from any ventilator
            var index = this.sideData.findIndex(d => d.device_id === data.ventdata.device_id)
            if (index === -1) {
                // New ventilator
                this.sideData.push({
                    device_id: data.ventdata.device_id,
                    data: data
                })
            } else {
                // Existing ventilator - set new data
                this.sideData[index].data = data
            }

            // Don't display data from non-active ventilators
            if (data.ventdata.device_id !== this.props.activeVentilator)
                return

            this.setState({data: this.showSide(data)})
        })
    }

    componentDidUpdate() {
        var vent = this.props.ventilators.find(v => v.id === this.props.activeVentilator)
        var statusChanged = false
        if (vent !== undefined && vent.status !== this.currentStatus) {
            statusChanged = true
            this.currentStatus = vent.status
        }

        if (this.props.activeVentilator !== this.currentVent || statusChanged) {
            console.log(`Ventilator changed to ${this.props.activeVentilator}`)
            // Ventilator changed - clear sidebar
            this.setState({
                data: {
                    triggerSettings: { offline: 1 },
                    vitalsigns: { offline: 1 }
                }
            })

            // If no ventilator is active or ventilator is offline, leave sidebar empty
            if (this.props.activeVentilator == -1 || vent.status === 'offline') {
                this.currentVent = this.props.activeVentilator
                return
            }

            // Load data from new ventilator
            var index = this.sideData.findIndex(d => d.device_id === this.props.activeVentilator)
            if (index !== -1) {
                var data = this.sideData[index].data
                this.setState({data: this.showSide(data)})
            }

            this.currentVent = this.props.activeVentilator
        }
    }

    render() {
        return(
            <div>
                <div>
                    <GraphView socket={this.props.socket} activeVentilator={this.props.activeVentilator} frozen={this.props.frozen}/>
                </div>

                <div className="side-info">
                    <SideCategory data={this.state.data.triggerSettings} name="Ventialtor Settings"/>
                    <SideCategory data={this.state.data.vitalsigns} name="Vital Signs"/>
                </div>

            </div>
        );
    }

}
