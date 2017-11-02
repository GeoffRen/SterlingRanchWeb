/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router';

/*************************************************************************/

import { Pile } from './pile';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target: undefined,
            startDrag: { x: 0, y: 0 },
            pile1: [],
            pile2: [],
            pile3: [],
            pile4: [],
            pile5: [],
            pile6: [],
            pile7: [],
            stack1: [],
            stack2: [],
            stack3: [],
            stack4: [],
            draw: [],
            discard: [],
        };

        this.onClick        = this.onClick.bind(this);
    }

    componentDidMount() {
        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`
        }).then(data => {
            this.setState({
                pile1: data.pile1,
                pile2: data.pile2,
                pile3: data.pile3,
                pile4: data.pile4,
                pile5: data.pile5,
                pile6: data.pile6,
                pile7: data.pile7,
                stack1: data.stack1,
                stack2: data.stack2,
                stack3: data.stack3,
                stack4: data.stack4,
                draw: data.draw,
                discard: data.discard
            });
        }).fail(err => {
            // TODO: Should show a helpful error message that the game could not be found
            console.log(err);
        });
    }

    onClick(ev) {
        let target = ev.target;
        console.log(target.id);
    }

    render() {
        return <div>
            <div className="card-row">
                <Pile
                    cards={this.state.stack1}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    cards={this.state.stack2}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    cards={this.state.stack3}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    cards={this.state.stack4}
                    spacing={0}
                    onClick={this.onClick}
                />
                <div className="card-row-gap"/>
                <Pile
                    cards={this.state.draw}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    cards={this.state.discard}
                    spacing={0}
                    onClick={this.onClick}
                />
            </div>
            <div className="card-row">
                <Pile cards={this.state.pile1} onClick={this.onClick}/>
                <Pile cards={this.state.pile2} onClick={this.onClick}/>
                <Pile cards={this.state.pile3} onClick={this.onClick}/>
                <Pile cards={this.state.pile4} onClick={this.onClick}/>
                <Pile cards={this.state.pile5} onClick={this.onClick}/>
                <Pile cards={this.state.pile6} onClick={this.onClick}/>
                <Pile cards={this.state.pile7} onClick={this.onClick}/>
            </div>
        </div>
    }
}

export default withRouter(Game);
