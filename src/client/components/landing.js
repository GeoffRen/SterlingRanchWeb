'use strict';


import React, { Component }     from 'react';
import { Link, withRouter }             from 'react-router-dom';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            homes: []
        }
    }

    componentDidMount() {
        $.ajax({
            url: '/homes'
        }).then(results => {
            this.setState({homes: results})
        }).catch(err => {
            return 'ERROR';
        });
    }

    render() {
        let homes = this.state.homes.map((home, index) =>
            <Link to={`/${home.value}`} key={index}>{home.value}</Link>);
        return <div>

                <div>{homes}</div>
        </div>
    };
}

export default withRouter(Landing);