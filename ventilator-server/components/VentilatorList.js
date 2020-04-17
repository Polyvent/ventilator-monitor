import React from 'react';

import VentilatorStatus from './VentilatorStatus';


export default class VentilatorList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="ventilator-list">
                <ul>
                    {this.props.ventilators.map((ventilator) => (
                        <li key={ventilator.id}>
                            <VentilatorStatus ventilator={ventilator} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

}
