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
        this.ventilators = [{
            name: "Ventilator 1",
            id: 4242,
            status: "okay"
        }, {
            name: "Ventilator 2",
            id: 3089,
            status: "alarm"
        }]


        this.state = {activeVentilator: this.ventilators[0].id}
        this.updateActiveVentilator = this.updateActiveVentilator.bind(this);
    }

    componentDidMount() {
        socket.on('ventilators', (data) => {
            console.log("Ventilators: ", data)
        })
    }

    updateActiveVentilator(ventId) {
        this.setState({activeVentilator: ventId})
    }

    render() {
        return (
            <div>
                <VentilatorList ventilators = {this.ventilators} activeVentilator={this.state.activeVentilator} updateActiveVentilator={this.updateActiveVentilator} />
                <VentilatorView ventilators = {this.ventilators} activeVentilator={this.state.activeVentilator} ventilatorData = {this.ventilatorData} socket = {socket} />
                <BottomButtonList />
            </div>
        );
    }
}
