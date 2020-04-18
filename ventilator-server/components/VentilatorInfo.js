import React from 'react'

export default class VentilatorInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        var unit = "";
        var value;
        switch (this.props.name.toLowerCase()) {
            case "peep":
                unit = "mbar"
                value = this.props.value.toFixed(1);
                break;
            case "fio2":
                unit = "Vol%"
                value = this.props.value.toFixed(1);
                break;
            case "rh":
                unit = "%"
                value = this.props.value.toFixed(1);
                break;
            case "rr":
                unit = "/min"
                value = this.props.value.toFixed(0);
                break;
            case "vt":
                unit = "mL"
                value = this.props.value.toFixed(0);
                break;
            case "mve":
                unit = "L/min"
                value = this.props.value.toFixed(0);
                break;
            case "press":
                unit = "mbar"
                value = this.props.value.toFixed(0);
                break;
            case "sbp": 
                unit = "mmHg"
                value = this.props.value.toFixed(0);
                break;
            case "dbp": 
                unit = "mmHg"
                value = this.props.value.toFixed(0);
                break;
            case "temp": 
                unit = "°C"
                value = this.props.value.toFixed(1);
                break;
            case "pulse": 
                unit = "BPM"
                value = this.props.value.toFixed(0);
                break;
            case "sao2": 
                unit = "%"
                value = this.props.value.toFixed(0);
                break; 
            default:
                unit = ""
                value = this.props.value.toFixed(0);
    
        }

        return(
            <div className="ventilator-info">
                <p className="info-name">{this.props.name} <span className="info-unit">{unit}</span></p>
                <p className="info-value">{value}</p>
            </div>
        )
    }

}
