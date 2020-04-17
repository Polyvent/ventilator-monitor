import React from 'react'

export default class VentilatorInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="ventilator-info">
                <p className="info-name">{this.props.name} <span className="info-unit">{getUnit(this.props.name)}</span></p>
                <p className="info-value">{this.props.value}</p>
            </div>
        )
    }

}

function getUnit(name) {
    switch (name.toLowerCase()) {
        case "peep":
            return "cmH2O"
        case "fio2":
            return "Vol%"
        default:
            return ""

    }
}
