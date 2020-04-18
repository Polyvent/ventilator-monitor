import React from 'react'

export default class VentilatorInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className="ventilator-info">
                <p className="info-name">{this.props.name} <span className="info-unit">{getUnit(this.props.name)}</span></p>
                <p className="info-value">{this.props.value.toFixed(0)}</p>
            </div>
        )
    }

}

function getUnit(name) {
    switch (name.toLowerCase()) {
        case "peep":
            return "mbar"
        case "fio2":
            return "Vol%"
        case "rh":
            return "%"
        case "rr":
            return "/min"
        case "vt":
            return "mL"
        case "mve":
            return "L/min"
        case "press":
            return "mbar"
        case "sbp": 
            return "mmHg"
        case "dbp": 
            return "mmHg"
        case "temp": 
            return "°C"
        case "pulse": 
            return "BPM"
        case "sao2": 
            return "%" 
        default:
            return ""

    }
}
