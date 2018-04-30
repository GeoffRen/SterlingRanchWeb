'use strict';


import React, {Component}       from 'react';
import {Link, withRouter}       from 'react-router-dom';

// The default home page.
class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homes: []
        }
    }

    // Queries for homes in the database.
    componentDidMount() {
        $.ajax({
            url: '/homes'
        }).then(results => {
            this.setState({homes: results})
        }).catch(err => {
            return 'ERROR';
        });
    }

    // Just contains links to all dashboard pages of each home in the database.
    render() {
        let homes = this.state.homes.map((home, index) =>
            <Link to={`/${home.value}`} key={index}>{home.value}</Link>);
        return <div>

                <div>{homes}</div>
        </div>
    };
}

export default withRouter(Landing);