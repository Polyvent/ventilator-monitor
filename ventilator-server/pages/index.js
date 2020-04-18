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
            showSettings: true //if you see this please CHANGE TO FALSE and commit
        }

        this.updateActiveVentilator = this.updateActiveVentilator.bind(this);
        this.toggleFreeze = this.toggleFreeze.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
    }

    componentDidMount() {
        socket.on('ventilators', (data) => {
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
        var showSettings = this.state.showSettings ? <Settings toggleSettings={this.toggleSettings} activeVentId={this.state.activeVentilator}/> : "";

        return (
            <div className="app">
                <div>
                    <VentilatorList ventilators = {this.state.ventilators} activeVentilator={this.state.activeVentilator} updateActiveVentilator={this.updateActiveVentilator} frozen={this.state.frozen}/>
                    <VentilatorView ventilators = {this.state.ventilators} activeVentilator={this.state.activeVentilator} ventilatorData = {this.ventilatorData} socket = {socket} frozen={this.state.frozen}/>
                    <BottomButtonList toggleFreeze={this.toggleFreeze} toggleSettings={this.toggleSettings} frozen={this.state.frozen}/>
                    {showSettings}
                </div>
            </div>
        );
    }
}
