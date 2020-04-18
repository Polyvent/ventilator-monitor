import React from 'react';

import SettingsBackground from './SettingsBackground';
import TriggerInput from './TriggerInput';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);
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
                        <input type="text" id="fname" name="fname"></input>
                        <label for="lname">Last name:</label>
                        <input type="text" id="lname" name="lname"></input>
                    </div>
                    <p>Triggers</p>
                    <div>
                        <TriggerInput />
                    </div>
                    <input type="button" value="Update" />
                </div>
            </div>
        );
    }

}
