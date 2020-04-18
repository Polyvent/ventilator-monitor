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
                    <h2>Settings - Ventilator {this.props.activeVentId}</h2>

                    <div className="settings-content">
                        <p className="settings-subtitle">Patient</p>
                        <div class="patient-name">
                            <input type="text" id="fname" name="fname" placeholder="First Name"/>
                            <input type="text" id="lname" name="lname" placeholder="Last Name"/>
                            <input type="button" value="Update"/>
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
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
