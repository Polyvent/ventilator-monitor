import React from 'react';

import GraphView from './GraphView';
import VentilatorInfo from './VentilatorInfo';


export default class VentilatorList extends React.Component {
    constructor(props) {
        super(props)
        this.showSide = ["VT", "PEEP", "FiO2"]
    }

    render() {
        return(
            <div>
                <div>
                    <GraphView />
                </div>

                <div className="side-info">
                    <ul>
                        {Object.entries(this.props.ventilatorData[0].data)
                            .filter(([key, value]) => this.showSide.includes(key))
                            .map(([key, value]) => (
                                <li className="ventilator-info-li" key={key}> <VentilatorInfo name={key} value={value}/> </li>
                        ))}
                    </ul>
                </div>

            </div>
        );
    }

}
