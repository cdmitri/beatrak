/* eslint react/jsx-max-props-per-line: 0 */
/* eslint react/jsx-sort-props: 0 */ 
import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';

import Prep from "../Prep/Prep.js"
import App from "../App/App.js"

const Root = (props) => {
    console.log("<Root>: props = ", props)
    return (
	  <BrowserRouter>
	    <Switch>
              <Route exact path="/" component={App} />
              <Route path="*" component={Prep} />
            </Switch>
          </BrowserRouter>
  )
}

export default Root;
