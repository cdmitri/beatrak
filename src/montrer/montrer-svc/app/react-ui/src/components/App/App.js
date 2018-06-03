//-*- mode: rjsx;-*-, eval: (auto-fill-mode 1); -*-
import React from "react";
import "./App.css" 
import {withRouter} from "react-router-dom"
import queryString from "query-string"
import SignalTable from  "../SignalTable/SignalTable.jsx"
import TrafficMap from  "../TrafficMap/TrafficMap.jsx" 
import ClusterTable from  "../ClusterTable/ClusterTable.jsx"

class App extends React.Component {

    constructor(props) {
	super(props)
	this.state = {
	    counter: 0,
	    timer: null,
	    signals: [],
	    verbose: false,
	};

        let search = queryString.parse(this.props.location.search)
	console.log("<App>: search => ", search)

	if(typeof search.verbose !== "undefined" && search.verbose === "true") {
	    console.log("<App>: do verbose")
	    this.state.verbose = true
	} else {
	    console.log("<App>: do normal")
	    this.state.verbose = false
	}
    }


    componentDidMount = () => {
	console.log("<App>: componentDidMount(): this.props => ", this.props)
	
	this.tick(); // to the first tick right away

	var timer = setInterval(this.tick, 1000)
	this.setState({timer: timer})
    }

    componentWillUnmount = () => {
	this.clearInterval(this.state.timer)
    }

    tick = () => {
	fetch("/api/v1/signals")
	    .then(res => {
		return res.json()
	    })
	    .then(signals => {
		this.setState({ signals });
	    });
    }
    
    render = () => {
	return (
		<div className="App">
		  <header className="App-header">
		    <h1 className="App-title">DEVSHELL</h1>
		  </header>
		  <div>
		    <SignalTable signals={this.state.signals} verbose={this.state.verbose}/>
		    <ClusterTable signals={this.state.signals} verbose={this.state.verbose}/>
	              <div style={{margin: "auto", marginBottom: "50px", width: '1100px', height: '600px'}}>
		        <TrafficMap signals={this.state.signals}/>
		      </div>
		  </div>
		</div>
	)
    }
}

withRouter(App)
export default App;




