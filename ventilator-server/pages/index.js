import React from 'react'
import ReactDOM from 'react-dom'

import Header           from '../components/Header'
import VentilatorList   from '../components/VentilatorList'
import VentilatorView   from '../components/VentilatorView'
import BottomButtonList    from '../components/BottomButtonList'

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
            frozen: false
        }

        this.updateActiveVentilator = this.updateActiveVentilator.bind(this);
        this.toggleFreeze = this.toggleFreeze.bind(this);
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

    updateActiveVentilator(ventId) {
        this.setState({activeVentilator: ventId, frozen: false})
    }

    render() {
        return (
            <div className="app">
                <div>
                    <VentilatorList ventilators = {this.state.ventilators} activeVentilator={this.state.activeVentilator} updateActiveVentilator={this.updateActiveVentilator} frozen={this.state.frozen}/>
                    <VentilatorView ventilators = {this.state.ventilators} activeVentilator={this.state.activeVentilator} ventilatorData = {this.ventilatorData} socket = {socket} frozen={this.state.frozen}/>
                    <BottomButtonList toggleFreeze={this.toggleFreeze} frozen={this.state.frozen}/>
                </div>
            </div>
        );
    }
}
