import React from 'react'
import LineGraph from './LineGraph'

export default class GraphView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <LineGraph socket={this.props.socket}/>
        );
    }

}
