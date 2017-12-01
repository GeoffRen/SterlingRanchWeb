/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router';

/*************************************************************************/

class Edit extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(ev) {
        ev.preventDefault();
        const data = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            city: document.getElementById('city').value,
        };
        let $error = $('#errorMsg');
        $.ajax({
            url: "/v1/user",
            method: "put",
            data: data
        })
            .then(() => {
                this.props.history.push(`/profile/${this.props.match.params.username}`);
            })
            .fail(err => {
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    render() {
        return <div className="row">
            <div className="col-xs-2"/>
            <div className="col-xs-8">
                <div className="center-block">
                    <p id="errorMsg" className="bg-danger"/>
                </div>
                <form className="form-horizontal">
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="first_name">First Name:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="first_name" type="text" placeholder="First Name"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="last_name">Last Name:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="last_name" type="text" placeholder="Last Name"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-sm-2 control-label" htmlFor="city">City:</label>
                        <div className="col-sm-10">
                            <input className="form-control" id="city" type="text" placeholder="City"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button onClick={this.onSubmit} className="btn btn-default">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="col-xs-2"/>
        </div>
    };
}

export default withRouter(Edit);
