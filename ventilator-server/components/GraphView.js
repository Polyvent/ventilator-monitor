import React from 'react'
import LineGraph from './LineGraph'

export default class GraphView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="graphContainer">
                <LineGraph socket={this.props.socket}/>
                <LineGraph socket={this.props.socket}/>
            </div>
        );
    }

}
