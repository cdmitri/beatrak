import React from 'react';
import GoogleMapReact from "google-map-react";
import "./TrafficMap.css"

//const H_SIZE = 30;
//const W_SIZE = 60;
//const H_STICK = 40;
//const W_STICK = 3;
//const R_CIRCLE = 8;

const H_SIZE = 30*3;
const W_SIZE = 60*3;
const H_STICK = 40*2;
const W_STICK = 3;
const R_CIRCLE = 8*2;

const TrafficMarkerStyle  = {
    position: "absolute",
    color: "black",
    background: "white",
    opacity: 0.9,
    border: "2px solid green",
    textAlign: "center",
    height: H_SIZE,
    width: W_SIZE,
    top: -(H_SIZE / 2 + H_STICK),
    left: -W_SIZE / 2
}

const TrafficMarkerHoverStyle  = {
    ...TrafficMarkerStyle,
    border: "4px solid orange",
    opacity: 1,
    cursor: "pointer",
    zIndex: 1000
};

const TrafficStickStyle  = {
    position: "absolute",
    opacity: 0.9,
    top: -H_STICK / 2.5,
    height: H_STICK / 2.5,
    width: W_STICK,
    backgroundColor: 'green'
};

const TrafficStickHoverStyle  = {
    ...TrafficStickStyle,
    width: W_STICK + 1,
    opacity: 1,
    cursor: "pointer",
    zIndex: 1000
};


const TrafficCircleStyle  = {
    position: "absolute",
    opacity: 0.9,
    height: R_CIRCLE,
    width: R_CIRCLE,
    top: -R_CIRCLE / 2,
    left: -R_CIRCLE / 2 + W_STICK / 2,
    borderRadius: R_CIRCLE,
    backgroundColor: "green"
};

const TrafficCircleHoverStyle  = {
    ...TrafficCircleStyle,
    opacity: 1,
    cursor: "pointer",
    height: R_CIRCLE + 2,
    width: R_CIRCLE + 2,
    borderRadius: R_CIRCLE + 2,
    zIndex: 1000
}

class TrafficMarker extends React.Component {
    render = () => {
//	const circleStyle = this.props.$hover ? TrafficCircleHoverStyle : TrafficCircleStyle;
//	const stickStyle = this.props.$hover ? TrafficStickHoverStyle : TrafficStickStyle;
//	const markerStyle = this.props.$hover ? TrafficMarkerHoverStyle : TrafficMarkerStyle;


	const circleStyle = TrafficCircleStyle
	const stickStyle = TrafficStickStyle
	const markerStyle = TrafficMarkerStyle

//	console.log("clusters = ", this.props.clusters)

	
	// just because I can ;))
	let clustersString = (() => {
	    let s = "{";
	    for(let cluster in this.props.clusters) {
		// console.log("TrafficMarker: cluster = " + cluster);
		s += (cluster === "0" ? "" : ",") +  this.props.clusters[cluster];
	    }
	    return s + "}";
	})()


//	let tableHTML =
//	    <table className="marker"><tbody>
//	    <tr><td>other cluster-1</td><td>90%</td></tr>
//      	    <tr><td>cluster-2</td><td>10%</td></tr>
//	    </tbody></table>

	let tableHTML =
	    <table className="marker"><tbody>
	    {this.props.percent.map(cluster => <tr key={cluster.stage1_cluster}><td>{cluster.stage1_cluster}</td><td>{cluster.sp}</td></tr>)}
	    </tbody></table>

	return (
	   <div>
	      <div style={circleStyle}/>
	      <div style={stickStyle}/>
	      <div style={markerStyle}>
		<div>
		  <b>{this.props.text}</b><br/>
		  {tableHTML}
		</div>
	      </div>
	    </div>
	)
    }
}



class TrafficMap extends React.Component {
    constructor(props) {
	super(props)

	console.log("<TrafficMap>: constructor(): props = ", props)
	
	this.state = {
	    //	    center: {lat: 50.8386789, lng: 4.32},
	    // center: {lat: 27.474023, lng: -81.460051},
	    center: {lat: 28.089426, lng: -81.590549},
	    zoom: 9
	    //signals: null
	};
    } // constructor


    getClusters = (signals,signal) => {
	// map returning {loc_name: "brussels", stage1_cluster : "cla"}, {loc_name: "brussels", stage1_cluster : "clb"}
	let clusters = signals.map(s => {return {"loc_name" : s.loc.name, "stage1_cluster" : s.stage1_cluster}}).filter((pair, index, pairs) => {
	    return pair.loc_name === signal.loc.name && pairs.indexOf(pair) === index
	}).map((pair) => {return pair.stage1_cluster});
	//console.log("clusters = ", clusters);
	return clusters;
    }

    getClustersAndPercent = (paths, signal) => {
	console.log("<TrafficMap>: getClustersAndPercent(): signal = ", signal)

	let beaconName = signal.loc.name
        console.log("<TrafficMap>: getClusterAnePercent(): beaconName = ", beaconName)
	
	//	let clusters = [{stage1_cluster: "cluser-1", sp : 85}, {stage1_cluster: "cluster-2", sp: 10}]
	let clusters = []

	for (var pi in paths) {
	    let path = paths[pi]

	    if(beaconName === path.loc.name) {
		console.log("<TrafficMap>: getClusterAnePercent(): found path, stage1_cluster = ", path.stage1_cluster)

		let cluster = null
		for (var ci in clusters) {
		    if(path.stage1_cluster === clusters[ci].stage1_cluster) {
			cluster = clusters[ci]
			clusters[ci].sp = parseInt(clusters[ci].sp,10) + parseInt(path.sp,10)
			clusters[ci].last_ts = path.last_ts
			break
		    }
		}
		if(cluster == null) {
		    clusters.push({stage1_cluster: path.stage1_cluster, sp: path.sp, last_ts: path.last_ts})
		}
	    }
	}

	// all the percentages are relative to the 100 of all the paths, so we need to normilize it to 100%
	// for this beacon only
	let total = clusters.reduce((sum, cluster) => {
	    return sum + parseInt(cluster.sp,10)
	}, 0)

	let normalized = clusters.map(cluster => {
	    cluster.sp = Math.round(cluster.sp / total * 100)
	    return {stage1_cluster: cluster.stage1_cluster, sp: cluster.sp}
	})

	return normalized.sort()
    }

        
    render() {
	const {
	    signals
	} = this.props;
	//console.log("render(): signals = ", signals);

	
	return (
	    <GoogleMapReact
	      bootstrapURLKeys={{
		  key: "AIzaSyD7Z-STVgCAuQ2OKnFCD7OdXV--bA-5UN0"
	      }}
              defaultCenter={this.state.center}
              defaultZoom={this.state.zoom}
	      >
			   {signals.map(signal =>
 					<TrafficMarker key={signal.beacon_id + ":" + signal.stage1_id}
			                lat={signal.loc.lonlat.split(',')[0]} 
			                lng={signal.loc.lonlat.split(',')[1]} 
				        text={signal.loc.name}
				        clusters={this.getClusters(signals,signal)}
				        percent={this.getClustersAndPercent(signals,signal)}
			                />
			   )}
			   
	    </GoogleMapReact>
	);
    }
}

export default TrafficMap




