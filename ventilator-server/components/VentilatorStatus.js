import React from 'react';

export default class VentillatorStatus extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var name = this.props.ventilator.name
        var status = this.props.frozen ? "frozen" : this.props.ventilator.status
        var isActiveClass = this.props.activeVentilator == this.props.ventilator.id ? "active-vent" : ""

        if(status !== undefined)
            return(
                <div className={"ventilator-status " + isActiveClass}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={"profile-img svg-"+status.toLowerCase()} width="16" height="16" viewBox="0 0 32 32">
                        <path d="M16,16A7,7,0,1,0,9,9,7,7,0,0,0,16,16ZM16,4a5,5,0,1,1-5,5A5,5,0,0,1,16,4Z"/><path d="M17,18H15A11,11,0,0,0,4,29a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1A11,11,0,0,0,17,18ZM6.06,28A9,9,0,0,1,15,20h2a9,9,0,0,1,8.94,8Z" />
                    </svg>
                    <div className="info">
                        <p>{name}</p>
                        <p className="status-data"><span className={"text-"+status.toLowerCase()}>{status.toUpperCase()}</span></p>
                    </div>
                </div>
            );
        else
            return(
                <div></div>
            );
    }

}
