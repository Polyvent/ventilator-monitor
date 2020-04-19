import React from 'react';

export default class TriggerInput extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }

    handleChange(event) {
        this.changeValue(event.target.name, event.target.value)
    }

    changeValue(name, value) {
        this.props.onChange(name, value)
    }

    render() {

        return(
            <div className="trigger-input">
                <p className="settings-subsubtitle">{this.props.name}</p>
                <div className="trigger-min">
                    <label for={this.props.vital+"Min"}>Min </label>
                    <p className="set-button set-minus" onClick={() => this.changeValue(this.props.vital + "Min", this.props.min - 1)}> <span>-</span></p>
                    <span className="settings-input"><input type="text" name={this.props.vital + "Min"} value={this.props.min} onChange={this.handleChange} placeholder="123" />
                    <input className="settings-unit" type="text" value={this.props.unit} disabled/></span>

                    <p className="set-button" onClick={() => this.changeValue(this.props.vital + "Min", this.props.min + 1)}> <span>+</span></p>
                </div>
                <div className="trigger-max">
                    <label for={this.props.vital+"Max"}>Max </label>
                    <p className="set-button set-minus" onClick={() => this.changeValue(this.props.vital + "Max", this.props.max - 1)}> <span>-</span></p>
                    <span className="settings-input"><input type="text" name={this.props.vital + "Max"} value={this.props.max} onChange={this.handleChange} placeholder="123" />
                    <input className="settings-unit" type="text" value={this.props.unit} disabled/></span>
                    <p className="set-button" onClick={() => this.changeValue(this.props.vital + "Max", this.props.max + 1)}> <span>+</span></p>
                </div>
            </div>
        );
    }

}
