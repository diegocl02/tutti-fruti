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
            },
            ready: false
        }
    }

    handleReady() {
        this.props.reportReady()
        this.setState({ ready: true })
    }

    render() {
        console.log('Props on gameboard', this.props)
        const moves = ["animal", "country", "object", "color", "name"]
        const opponents = this.props.users.filter(user => user.username !== this.props.user)

        return (
            <section className="section">
                <div className="content">
                    <p> {this.props.letter ? <span> Words with letter: <b> {this.props.letter} </b> </span> : " Waiting for other players.."} </p>
                    <button className="button" disabled={this.state.ready} onClick={() => { this.handleReady() }}> {this.state.ready ? "waiting" : "Ready"} </button>
                </div>
                <div className="columns">
                    <div className="column">
                        <p className={"notification is-primary"}> Usuario </p>
                    </div>
                    {["Animal", "Pais", "Cosa", "Color", "Nombre"].map((field) => {
                        return <div className="column">
                            <p className={"notification is-secondary"}> {field} </p>
                        </div>
                    })}
                </div>
                <div className="columns">
                    <div className="column" key={`col-input`} >
                        {this.props.user}
                    </div>
                    {moves.map(move => {
                        return <div className="column" key={`${move}-input`}>
                            <input
                                disabled={this.props.letter === null || this.props.gameOver}
                                className={"input"}
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
                                <div className="columns is-vcentered is-hcentered" style={{ justifyContent: "center" }}> 
                                    {typeof user.play[move] === "number" ? hiddenBlocks.map(block => block) :  user.play[move]}
                                    </div>
                            </div>
                        })}
                    </div>
                })}
            </section>
        );
    }
}
