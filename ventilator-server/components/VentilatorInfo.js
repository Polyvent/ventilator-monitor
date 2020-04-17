import React from 'react';

export default class VentilatorInfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                {this.props.name} {this.props.value} {getUnit(this.props.name)}
            </div>
        );
    }

}

function getUnit(name) {
    switch (name.toLowerCase()) {
        case "peep":
            return "cmH2O"
            break;
        default:
            return ""

    }
}
