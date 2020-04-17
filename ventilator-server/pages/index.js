import React from 'react';
import ReactDOM from 'react-dom';

import Header           from '../components/Header';
import VentilatorList   from '../components/VentilatorList';
import VentilatorView   from '../components/VentilatorView';

import io from 'socket.io-client';
const socket = io('/realtime');


export default function Index() {
    return (
        <App />
    )
}

class App extends React.Component {
    constructor(props) {
        super(props);

        //Temporary
        this.ventilators = [{
            name: "Ventilator 1",
            status: "okay"
        }, {
            name: "Ventilator 2",
            status: "alarm"
        }]

    }

    render() {
        return (
            <div>
                <VentilatorList ventilators = {this.ventilators} />
                <VentilatorView />
            </div>
        );
    }
}
