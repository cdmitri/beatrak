import React from "react";
const moment = require("moment");

class ClusterTable extends React.Component {
    constructor(props) {
	super(props)

//	console.log("<ClusterTable>: constructor(): props = ", props)
	
	this.state = {
	    signals: null
	};
    } // constructor

    componentDidMount = () => {
//	console.log("<ClusterTable>: componentDidMount(): start")
//	console.log("<ClusterTable>: componentDidMount(): this.props = ", this.props)
//	this.setState({signals: this.props.signals})
//	this.tick() // to 1 tick right away
//	var timer = setInterval(this.tick, 1000)
//	this.setState({timer: timer})
//	console.log("<ClusterTable>: componentDidMount(): finish")
    }

    componentWillUnmount = () => {
//	console.log("<ClusterTable>: unount(): start")
	this.clearInterval(this.state.timer)
    }

    tick = () => {
	//console.log("<ClusterTable>: tick(): start")
	this.setState({
	    counter: this.state.counter + 1
	});
	//console.log("<ClusterTable>: tick(): finish")
    }
    
    render() {
	const {
	    signals
	} = this.props;

//	console.log("<ClusterTable>: render(): start")
//	console.log("<ClusterTable>: render(): signals", signals)

	//	var clusters = [{stage1_cluster: "prem-1", sp:100}, {stage1_cluster: "prem-2", sp:200}]
	var clusters = []

//	console.log("<ClusterTable>: clusters = ", clusters)

	for (var si in signals) {
	    let signal = signals[si]
//	    console.log("signal =>", signal)

//	    console.log("signal.stage1_cluster =>", signal.stage1_cluster)

	    let cluster = null
	    for (var ci in clusters) {
//		console.log("cluster = ", clusters[ci])
		if(signal.stage1_cluster === clusters[ci].stage1_cluster) {
//		    console.log("found")
		    cluster = clusters[ci]
		    clusters[ci].sp = parseInt(clusters[ci].sp,10) + parseInt(signal.sp,10)
		    clusters[ci].last_ts = signal.last_ts
		    break
		} else {
		    // console.log("not found")
		}
	    }
	    if(cluster == null) {
		clusters.push({stage1_cluster: signal.stage1_cluster, sp: signal.sp, last_ts: signal.last_ts})
	    }
	}

//	console.log("final clusters = ", clusters)
	
	return (
	    <div>
     	      <table><tbody>
	            <tr>
      		     <th>service</th>
		     <th>traffic %</th>
    		     <th>last cluster</th>
		    </tr>
		    {clusters.map(cluster =>
			       <tr key={cluster.stage1_cluster + ":" + 10}>
				     <td>{cluster.stage1_cluster}</td>
				     <td>{cluster.sp}</td>
			             <td>{moment(cluster.last_ts).format("YYYY-MM-DD HH:mm:ss")}</td>
			       </tr>
	          )}
	       </tbody></table>
	    </div>
	)
	
    }

} // ClusterTable

export default ClusterTable
