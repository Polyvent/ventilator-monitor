import React from 'react';

import GraphView from './GraphView';
import VentilatorInfo from './VentilatorInfo';


export default class VentilatorList extends React.Component {
    state = {
        data: {}
    }

    constructor(props) {
        super(props)
    }

    showSide(data) {
        return {
            VT: data.ventdata.processed.triggerSettings.VT,
            PEEP: data.ventdata.processed.triggerSettings.PEEP,
            FiO2: data.ventdata.processed.triggerSettings.FiO2,
            O2: data.ventdata.raw.O2
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
                    <GraphView socket = {this.props.socket} />
                </div>

                <div className="side-info">
                    <ul>
                        {Object.entries(this.state.data)
                            .map(([key, value]) => (
                                <li className="ventilator-info-li" key={key}> <VentilatorInfo name={key} value={value}/> </li>
                        ))}
                    </ul>
                </div>

            </div>
        );
    }

}
