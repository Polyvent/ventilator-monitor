import React from 'react';

export default class SettingsBackground extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="settings-background" onClick={this.props.toggleSettings}>
            </div>
        );
    }
    
}
