import React, { Component } from "react";

import "bulma/css/bulma.css";

export class GameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            play: {
                animal: null,
                country: null,
                object: null
            }
        }
    }

    render() {
        const moves = ["animal", "country", "object"]
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
                    <div className="column" key={`col-input`} >
                        {this.props.user}
                    </div>
                    {moves.map(move => {
                        return <div className="column" key={`${move}-input`}>
                            <input
                                type="text"
                                onChange={(e => this.setState({ play: { ...this.state.play, [move]: e.target.value } }))}
                                onBlur={(e) => this.props.onChange({ type: move, content: this.state.play[move] })}
                            />
                        </div>
                    })}
                </div>
                {opponents.map((user, index) => {
                    return <div className="columns is-vcentered">
                        <div className="column" key={`${index}-col`}> {user.username} </div>
                        {moves.map(move => {
                            const numBlocks = Math.floor(user.play[move] / 2) > 5 ? 5 : Math.floor(user.play[move] / 2)
                            const hiddenBlocks = []
                            for (let i = 0; i < numBlocks; i++) {
                                hiddenBlocks.push(<div
                                    className={"has-background-grey-light"}
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        margin: "5px"
                                    }}>
                                </div>)
                            }
                            return <div className="column" key={`${index}-${move}`} >
                                <div className="columns is-vcentered is-hcentered" style={{ justifyContent: "center" }}> {hiddenBlocks.map(block => block)} </div>
                            </div>
                        })}
                    </div>
                })}
            </div>
        );
    }
}
