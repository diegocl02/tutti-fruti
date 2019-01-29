import React, { Component } from "react";

import "bulma/css/bulma.css";

export class GameBoard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const opponents = this.props.users.filter(user => user.username !== this.props.user)
        return (
            <div>
            <div className="columns">
                <div className="column">
                    Usuario
                </div>
                <div className="column">
                    Animal
                </div>
                <div className="column">
                    Pais
                </div>
                <div className="column">
                    Cosa
                 </div>
            </div>
            <div className="columns">
                <div className="column">
                    {this.props.user}
                </div>
                <div className="column">
                    <input type="text" onChange={(e => this.props.onChange({ type: "animal", content: e.target.value }))}/>
                </div>
                <div className="column">
                    <input type="text" />
                </div>
                <div className="column">
                    <input type="text" />
                </div>
            </div>
                {opponents.map(user => {
                    return <div className="columns">
                        <div className="column"> {user.username} </div>
                        <div className="column"> {user.play.animal} </div>
                        <div className="column"> {user.play.country} </div>
                        <div className="column"> {user.play.object} </div>
                        </div>
                })}
            </div>
        );
    }
}
