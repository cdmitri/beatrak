/* eslint react/jsx-max-props-per-line: 0 */
/* eslint react/jsx-sort-props: 0 */ 
import React from 'react'
import {withRouter} from "react-router-dom"
import queryString from "query-string"

const Prep = (props) => {
    console.log("<Prep>: this.props = ", this.props)
    console.log("<Prep>: props = ", props)
    console.log("<Prep>: props.location = ", props.location)
    console.log("<Prep>: props.location.search = ", props.location.search)

    let search = queryString.parse(props.location.search)
    console.log("<Prep>: search = ", search)
    return (
	<div></div>
    )
}

withRouter(Prep)
export default Prep

