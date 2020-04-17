import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../components/Header';

import io from 'socket.io-client';
const socket = io();


export default function Index() {
    return (
        <App />
    )
}

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Ventilator-Monitor</h1>
            </div>
        );
    }
}
