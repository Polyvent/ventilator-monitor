import React from 'react';

import VentilatorInfo from './VentilatorInfo';


export default class SideCategory extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        console.log(`Data: ` + JSON.stringify(this.props.data))
        return(
            <div className="side-category">
                <div>
                    <ul>
                        <li className="ventilator-category-li">
                            <p>{this.props.name.toUpperCase()}</p>
                        </li>
                        
                        {this.props.data.offline ? (
                            <li className="ventilator-info-li">
                                <p className="offline-right">OFFLINE</p>
                            </li>
                        ) : Object.entries(this.props.data)
                            .map(([key, value]) => (
                                <li className="ventilator-info-li" key={key}>
                                    <VentilatorInfo name={key} value={value}/>
                                </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}
