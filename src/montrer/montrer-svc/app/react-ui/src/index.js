import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from "react-router-dom"
//import {Router,Route} from "react-router-dom"
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
	<BrowserRouter>
	<Route exact path="/">
	<App/>
	</Route>
    </BrowserRouter>,
    document.getElementById('root')
)
registerServiceWorker();
