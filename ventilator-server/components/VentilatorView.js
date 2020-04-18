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
                VT: {
                    value: data.ventdata.processed.triggerSettings.VT,
                    alarm: false
                }, PEEP: {
                    value: data.ventdata.processed.triggerSettings.PEEP,
                    alarm: false
                }, FiO2: {
                    value: data.ventdata.processed.triggerSettings.FiO2,
                    alarm: false
                }, MVe: {
                    value: data.ventdata.processed.triggerSettings.MVe,
                    alarm: false
                }, RR: {
                    value: data.ventdata.processed.triggerSettings.RR,
                    alarm: false
                }, RH: {
                    value: data.ventdata.processed.triggerSettings.humidity,
                    alarm: false
                }, P: {
                    value: data.ventdata.processed.triggerSettings.pressure_max,
                    alarm: false
                }
            },
            vitalsigns: {
                SBP: {
                    value: data.vitalsigns.bloodpressure.systole,
                    alarm: data.alarms.systole
                }, DBP: {
                    value: data.vitalsigns.bloodpressure.diastole,
                    alarm: data.alarms.diastole
                }, Temp: {
                    value: data.vitalsigns.bodyTemperature,
                    alarm: data.alarms.bodyTemperature
                }, Pulse: {
                    value: data.vitalsigns.heartRate,
                    alarm: data.alarms.heartRate
                }, SaO2: {
                    value: data.vitalsigns.oxygenSaturation,
                    alarm: data.alarms.oxygenSaturation
                }
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
