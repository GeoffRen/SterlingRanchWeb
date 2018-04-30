"use strict";

import React, {Component}               from 'react';
import {render}                         from 'react-dom';
import {BrowserRouter, Route, Switch}   from 'react-router-dom';

import Analytics from './components/analytics';
import Landing from './components/landing';
import Nav from './components/nav'

require('./app.css');

class MyApp extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <BrowserRouter>
            <div>
                <Nav/>
                <Switch>
                    <Route exact path="/" component={Landing}/>
                    <Route exact path="/:home_id" component={Analytics}/>
                </Switch>
            </div>
        </BrowserRouter>
    }
}

render(
    <MyApp/>,
    document.getElementById('mainDiv')
);
