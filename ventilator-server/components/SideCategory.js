import React from 'react';

import VentilatorInfo from './VentilatorInfo';


export default class SideCategory extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {

    }

    render() {
        console.log({data: this.props.data })
        if(this.props.data !== undefined) {
            return(
                <div class="side-category">
                    <div>
                        <ul>
                            <li className="ventilator-category-li">
                                <p>{this.props.name.toUpperCase()}</p>
                            </li>
                            {Object.entries(this.props.data)
                                .map(([key, value]) => (
                                    <li className="ventilator-info-li" key={key}>
                                        <VentilatorInfo name={key} value={value}/>
                                    </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        } else {
            return(
                <div>
                    <div>
                        <ul></ul>
                    </div>
                </div>
            )
        }
    }

}
