import React from 'react';

export default class SettingsBackground extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div class="settings-background" onClick={this.props.toggleSettings}>
            </div>
        );
    }

}
