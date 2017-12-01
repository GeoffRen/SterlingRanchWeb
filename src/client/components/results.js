/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';

import React, { Component }         from 'react';
import { withRouter, Link }         from 'react-router-dom';

/*************************************************************************/

const Move = ({ move, index, gameId }) => {
    const duration = Date.now() - move.date;
    let cards = move.move.cards.map(card => ` ${card.value} of ${card.suit}`);
    let moveId = move.id ? move.id : index + 1;
    return <tr>
        <th>{moveId}</th>
        <th>{duration} seconds</th>
        <th><Link to={`/profile/${move.player}`}>{move.player}</Link></th>
        <th><Link to={`/results/${gameId}/${moveId}`}>{`${cards} from ${move.move.src} to ${move.move.dst}`}</Link></th>
    </tr>
};

class Results extends Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                moves: []
            }
        }
    }

    componentDidMount() {
        $.ajax({ url: `/v1/game/${this.props.match.params.id}`})
            .then(data => {
                this.setState({ game: data });
            }).fail(err => {
                console.log("ERROR: " + err);
                let errorEl = document.getElementById('errorMsg');
                errorEl.innerHTML = `Error: ${err.responseJSON.error}`;
            });
    }

    render() {
        let moves = this.state.game.moves.map((move, index) => (
            <Move key={index} move={move} index={index} gameId={this.props.match.params.id}/>
        ));
        const duration = this.state.game.start ? (Date.now() - this.state.game.start) / 1000 : '--';
        return <div className="row">
            <div className="center-block">
                <p id="errorMsg" className="bg-danger"/>
            </div>
            <div className="col-xs-2"><h4>Game Detail</h4></div>
            <div className="col-xs-10">
                <div className="row">
                    <div className="col-xs-3 text-right">
                        <p><b>Duration:</b></p>
                        <p><b>Number of Moves:</b></p>
                        <p><b>Points:</b></p>
                        <p><b>Cards Remaining:</b></p>
                        <p><b>Able to Move:</b></p>
                    </div>
                    <div className="col-xs-6">
                        <p>{duration} seconds</p>
                        <p>{this.state.game.moves.length}</p>
                        <p>{this.state.game.score}</p>
                        <p>{this.state.game.cards_remaining}</p>
                        <p>{this.state.game.active? "Active" : "Complete"}</p>
                    </div>
                </div>
                <div className="row">
                    <table id="gameTable" className="col-xs-12 table">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Duration</th>
                            <th>Player</th>
                            <th>Move Details</th>
                        </tr>
                        </thead>
                        <tbody>{moves}</tbody>
                    </table>
                </div>
            </div>
        </div>;
    }
}

export default withRouter(Results);
