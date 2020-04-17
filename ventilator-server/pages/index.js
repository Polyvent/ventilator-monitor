import React from 'react'
import ReactDOM from 'react-dom'

import Header           from '../components/Header'
import VentilatorList   from '../components/VentilatorList'
import VentilatorView   from '../components/VentilatorView'

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
            id: 0,
            status: "okay"
        }, {
            name: "Ventilator 2",
            id: 1,
            status: "alarm"
        }]

        //Temporary, should be updated by socket.io regularly
        this.ventilatorData = [{
            ventId: 0,
            timestamp: new Date(),
            data: {
                VT: 18,
                PEEP: 9.2,
                FiO2: 15,
                IVe: 123
            }
        }, {
            ventId: 1,
            timestamp: new Date(),
            data: {
                VT: 15,
                PEEP: 12.3,
                FiO2: 17,
                IVe: 456
            }
        }]

    }

    render() {
        return (
            <div>
                <VentilatorList ventilators = {this.ventilators} />
                <VentilatorView ventilators = {this.ventilators} ventilatorData = {this.ventilatorData} />
            </div>
        );
    }
}
