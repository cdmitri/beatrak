//-*- mode: rjsx;-*-, eval: (auto-fill-mode 1); -*-
import React from "react";
import "./App.css" 
import SignalTable from "./SignalTable.jsx"
import SignalMap from "./SignalMap.jsx"
import {withRouter} from "react-router-dom"
//import queryString from "query-string"

class App extends React.Component {

    constructor(props) {
	super(props)
	this.state = {
	    counter: 0,
	    timer: null,
	    signals: [],
	};


//        let search = queryString.parse(this.props.location.search)
//	console.log("<ActivateAccount>: getSearch(): search => ", search)

	
	console.log("<App>: constructor(): this.props => ", this.props)

	
	// read the ?verbose flag from the URL
	this.state.verbose = true
	
	console.log("<App>: constructor(): this.state => ", this.state)
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
	    // console.log("<App>: tick(): res => ", res)
	    return res.json()
	})
	.then(signals => {
	    // console.log("<App>: tick(): signals => ", signals)

	    this.setState({ signals });
	    //console.log("<App>: tick(): state => ", this.state)
	});
    }

  render = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">DEVSHELL</h1>
        </header>
	<div>
	  <SignalTable signals={this.state.signals} verbose="false"/>
	  <div style={{margin: "auto", marginBottom: "50px", width: '1100px', height: '600px'}}>
          <SignalMap signals={this.state.signals}/>
	  </div>
        </div>
      </div>
    );
  }
}

withRouter(App)
export default App;
