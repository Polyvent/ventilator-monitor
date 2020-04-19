import React from 'react'
import ReactDOM from 'react-dom'

import Header               from '../components/Header'
import VentilatorList       from '../components/VentilatorList'
import VentilatorView       from '../components/VentilatorView'
import BottomButtonList     from '../components/BottomButtonList'
import Settings             from '../components/Settings'

import io from 'socket.io-client'
const socket = io('/realtime')


export default function Index() {
    return (
        <App />
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)

        //Temporary
        this.state =  {
            ventilators : [],
            activeVentilator: -1,
            frozen: false,
            showSettings: false,
            alarms: []
        }

        this.updateActiveVentilator = this.updateActiveVentilator.bind(this);
        this.toggleFreeze = this.toggleFreeze.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
    }

    componentDidMount() {
        // Keep track of alarms for clear alarms button
        socket.on('data', (data) => {
            var alarmSet = this.state.alarms.includes(data.ventdata.device_id)

            // Add alarm if necessary
            if ((data.alarms !== undefined) && !alarmSet) {
                console.log(`Alarm for device ${data.ventdata.device_id}`)
                var newAlarms = this.state.alarms.concat(data.ventdata.device_id)
                this.setState({
                    alarms: newAlarms
                })
            }

            // Remove alarm if necessary
            if ((data.alarms === undefined) && alarmSet) {
                console.log(`Clear alarm for device ${data.ventdata.device_id}`)
                var newAlarms = this.state.alarms.filter(a => a !== data.ventdata.device_id)
                this.setState({
                    alarms: newAlarms
                })
            }
        })

        socket.on('ventilators', (data) => {
            console.log("New ventilators: ", data)
            this.setState({
                ventilators: data
                // ventilators: data.map(d => {
                //     return {
                //         name: d.firstName + " " + d.lastName,
                //         id: d.deviceID,
                //         status: "okay"
                //     }
                // })
            })

            if (this.state.activeVentilator === -1)
                this.updateActiveVentilator(this.state.ventilators.length > 0 ? this.state.ventilators[0].id : -1)
        })
    }

    toggleFreeze() {
        this.setState({frozen: !this.state.frozen})
    }

    toggleSettings() {
        this.setState({showSettings: !this.state.showSettings})
    }

    updateActiveVentilator(ventId) {
        this.setState({activeVentilator: ventId, frozen: false})
    }

    render() {
        var showSettings = this.state.showSettings ? <Settings socket={socket} activeVentilator={this.state.activeVentilator} ventilators = {this.state.ventilators} toggleSettings={this.toggleSettings} /> : "";

        return (
            <div className="app">
                <div>
                    <VentilatorList ventilators = {this.state.ventilators} activeVentilator={this.state.activeVentilator} updateActiveVentilator={this.updateActiveVentilator} frozen={this.state.frozen}/>
                    <VentilatorView ventilators = {this.state.ventilators} activeVentilator={this.state.activeVentilator} ventilatorData = {this.ventilatorData} socket = {socket} frozen={this.state.frozen}/>
                    <BottomButtonList alarmActive={this.state.alarms.includes(this.state.activeVentilator)} socket={socket} activeVentilator={this.state.activeVentilator} toggleFreeze={this.toggleFreeze} toggleSettings={this.toggleSettings} frozen={this.state.frozen}/>
                    {showSettings}
                    <div className="project-name">
                        <h1>Polyvent</h1>
                    </div>
                </div>
            </div>
        );
    }
}
