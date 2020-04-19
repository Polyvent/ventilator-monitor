import React from 'react';

export default class TriggerInput extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
    }
    
    state = {
        min: 0,
        max: 0
    }

    handleChange(event) {
        //if ()
        this.props.onChange(event, this.props.vital, event.target.value)
    }

    render() {

        return(
            <div className="trigger-input">
                <p className="settings-subsubtitle">{this.props.name}</p>
                <div className="trigger-min">
                    <label for={"min"+this.props.name}>Min </label>
                    <p className="set-button set-minus"> <span>-</span></p>
                    <span className="settings-input"><input type="text" name={"min"+this.props.name} placeholder="123" />
                    <input className="settings-unit" type="text" value={this.props.unit} disabled/></span>

                    <p className="set-button"> <span>+</span></p>
                </div>
                <div className="trigger-max">
                    <label for={"max"+this.props.name}>Max </label>
                    <p className="set-button set-minus"> <span>-</span></p>
                    <span class="settings-input"><input type="text" name={"max"+this.props.name} placeholder="123" />
                    <input className="settings-unit" type="text" value={this.props.unit} disabled/></span>
                    <p className="set-button"> <span>+</span></p>
                </div>
            </div>
        );
    }

}
