/* Copyright G. Hemingway, 2017 - All rights reserved */
'use strict';


import React, { Component }     from 'react';
import { withRouter }           from 'react-router';

/*************************************************************************/

import { Pile } from './pile';

class ResultGame extends Component {
    constructor(props) {
        super(props);
        this.state = {
            target: undefined,
            startDrag: { x: 0, y: 0 },
            drawCount: 1,
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

        this.fullScreenStyle = {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: "100%",
            width: "100%"
        };
    }

    componentDidMount() {
        $.ajax({
            url: `/v1/game/${this.props.match.params.id}`,
            data: {moveid: this.props.match.params.moveid}
        }).then(data => {
            this.setState({
                drawCount: data.drawCount,
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

    render() {
        return <div>
            <div onClick={this.removeHighlight} style={this.fullScreenStyle} />
            <div className="card-row">
                <Pile
                    pileName="stack1"
                    cards={this.state.stack1}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="stack2"
                    cards={this.state.stack2}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="stack3"
                    cards={this.state.stack3}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="stack4"
                    cards={this.state.stack4}
                    spacing={0}
                    onClick={this.onClick}
                />
                <div className="card-row-gap"/>
                <Pile
                    pileName="draw"
                    cards={this.state.draw}
                    spacing={0}
                    onClick={this.onClick}
                />
                <Pile
                    pileName="discard"
                    cards={this.state.discard}
                    spacing={this.state.drawCount > 1 ? 10 : 0}
                    onClick={this.onClick}
                    horizontal={this.state.drawCount > 1}
                />
            </div>
            <div className="card-row">
                <Pile pileName="pile1" cards={this.state.pile1} onClick={this.onClick}/>
                <Pile pileName="pile2" cards={this.state.pile2} onClick={this.onClick}/>
                <Pile pileName="pile3" cards={this.state.pile3} onClick={this.onClick}/>
                <Pile pileName="pile4" cards={this.state.pile4} onClick={this.onClick}/>
                <Pile pileName="pile5" cards={this.state.pile5} onClick={this.onClick}/>
                <Pile pileName="pile6" cards={this.state.pile6} onClick={this.onClick}/>
                <Pile pileName="pile7" cards={this.state.pile7} onClick={this.onClick}/>
            </div>
        </div>
    }
}

export default withRouter(ResultGame);
