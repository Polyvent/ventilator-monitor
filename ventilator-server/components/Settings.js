import React from 'react';

import SettingsBackground from './SettingsBackground';
import TriggerInput from './TriggerInput';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleChange = this.handleChange.bind(this)

        console.log({dataa: this.props.ventilators})
    }

    state = {
        firstName: "",
        lastName: ""
    }

    handleUpdate() {
        this.props.socket.emit('config', {
            device_id: this.props.activeVentilator,
            ventilator: {
                device_id: this.props.activeVentilator,
                firstName: this.state.firstName,
                lastName: this.state.lastName
            }
        })
    }

    handleChange(event) {
        var name = event.target.name
        var value = event.target.value

        this.setState({
            [name]: value
        })
    }

    componentDidMount() {
        var index = this.props.ventilators.findIndex(d => d.id === this.props.activeVentilator)
        this.setState({
            firstName: this.props.ventilators[index].firstName,
            lastName: this.props.ventilators[index].lastName
        })
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
                            <input type="button" value="Update" onClick={this.handleUpdate}/>
                        </div>

                        <p className="settings-subtitle">Triggers</p>
                        <div className="triggers">
                            <ul>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="DBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>

                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="SBP" unit="mmHg" />
                                </li>
                                <li>
                                    <TriggerInput name="END" unit="mmHg" />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
