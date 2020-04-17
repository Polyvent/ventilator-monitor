import React from 'react';

import GraphView from './GraphView';
import VentilatorInfo from './VentilatorInfo';


export default class VentilatorList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <div>
                    <GraphView socket = {this.props.socket} />
                </div>

                <div>
                    <ul>
                        {Object.entries(this.props.ventilatorData[0].data).map(([key, value]) => (
                            <li key={key}> <VentilatorInfo name={key} value={value}/> </li>
                        ))}
                    </ul>
                </div>

            </div>
        );
    }

}
