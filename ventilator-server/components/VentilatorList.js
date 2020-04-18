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
                        <li key={ventilator.id} onClick={() => this.props.updateActiveVentilator(ventilator.id)}>
                            <VentilatorStatus ventilator={ventilator} activeVentilator={this.props.activeVentilator} frozen={this.props.frozen}/>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

}
