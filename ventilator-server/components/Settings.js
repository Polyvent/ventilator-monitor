import React from 'react';

import SettingsBackground from './SettingsBackground';
import TriggerInput from './TriggerInput';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.handleUpdate = this.handleUpdate.bind(this)
        this.handleChange = this.handleChange.bind(this)
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



    render() {
        return(
            <div>
                <SettingsBackground toggleSettings={this.props.toggleSettings}/>

                <div className="settings-pop-up">
                    <h2>Settings</h2>
                    <p>Patient</p>
                    <div>
                        <label for="fname">First name:</label>
                        <input type="text" id="fname" name="firstName" value={this.state.firstName} onChange={this.handleChange}></input>
                        <label for="lname">Last name:</label>
                        <input type="text" id="lname" name="lastName" value={this.state.lastName} onChange={this.handleChange}></input>
                    </div>
                    <p>Triggers</p>
                    <div>
                        <TriggerInput />
                    </div>
                    <input type="button" value="Update" onClick={this.handleUpdate} />
                </div>
            </div>
        );
    }

}
