/* eslint react/jsx-max-props-per-line: 0 */
/* eslint react/jsx-sort-props: 0 */ 
import React from 'react';
import {
    BrowserRouter,
    Route,
    Switch,
} from 'react-router-dom';

//import App from './App';
//import Home from './Home';
//import About from './About';
//import Page from './Page';

import Prep from "../Prep/Prep.js"

const Root = (props) => {
    console.log("<Root>: props = ", props)
    return (
	  <BrowserRouter>
	  <Switch>
          <Route path="*" component={Prep} />
            </Switch>
          </BrowserRouter>
  )
}

export default Root;
