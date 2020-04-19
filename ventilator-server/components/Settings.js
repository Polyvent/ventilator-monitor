import React from 'react';

import SettingsBackground from './SettingsBackground';
import TriggerInput from './TriggerInput';

const vitals = [
    {
        title: "SBP",
        vital: "systole",
        unit: "mmHg"
    },
    {
        title: "DBP",
        vital: "diastole",
        unit: "mmHg"
    },
    {
        title: "Temp",
        vital: "bodyTemperature",
        unit: "°C"
    },
    {
        title: "Pulse",
        vital: "heartRate",
        unit: "BPM"
    },
    {
        title: "SaO2",
        vital: "oxygenSaturation",
        unit: "%"
    }
]

export default class Settings extends React.Component {
    state = {
        firstName: "",
        lastName: ""
    }

    constructor(props) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleTriggerChange = this.handleTriggerChange.bind(this)

        console.log({dataa: this.props.ventilators})
    }

    handleUpdateButton(e) {
        e.handleUpdate()
        e.props.toggleSettings()
    }

    handleUpdate() {
        var data = {
            deviceID: this.props.activeVentilator,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            limits: {}
        }

        vitals.forEach(v => {
            data.limits[v.vital + "Min"] = Number(this.state[v.vital + "Min"])
            data.limits[v.vital + "Max"] = Number(this.state[v.vital + "Max"])
        })

        this.props.socket.emit('config', data)
    }

    handleChange(event) {
        var name = event.target.name
        var value = event.target.value

        this.setState({
            [name]: value
        })
    }

    handleTriggerChange(limit, value) {
        this.setState({
            [limit]: value
        })
    }

    componentDidMount() {
        var newState = {}
        var index = this.props.ventilators.findIndex(d => d.id === this.props.activeVentilator)
        newState.firstName = this.props.ventilators[index].firstName
        newState.lastName = this.props.ventilators[index].lastName
        vitals.forEach(v => {
            newState[v.vital + "Min"] = this.props.ventilators[index].limits[v.vital + "Min"]
            newState[v.vital + "Max"] = this.props.ventilators[index].limits[v.vital + "Max"]
        })
        this.setState(newState)
    }


    render() {
        var index = this.props.ventilators.findIndex(d => d.id === this.props.activeVentilator)
        return(
            <div>
                <SettingsBackground toggleSettings={this.props.toggleSettings}/>

                <div className="settings-pop-up">
                    <h2>Settings - {this.props.ventilators[index].name}</h2>

                    <div className="settings-content">
                        <p className="settings-subtitle">Patient</p>
                        <div className="patient-name">
                            <input type="text" id="fname" name="firstName" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange}/>
                            <input type="text" id="lname" name="lastName" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange}/>
                        </div>

                        <p className="settings-subtitle">Triggers</p>
                        <div className="triggers">
                            <ul>
                                {vitals.map(v => (
                                    <TriggerInput name={v.title} unit={v.unit} vital={v.vital} min={this.state[v.vital + "Min"]} max={this.state[v.vital + "Max"]} onChange={this.handleTriggerChange}/>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <input className="settings-buttons" type="button" value="Update" onClick={() => this.handleUpdateButton(this)}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
