import React, { Component } from "react";

import 'bulma/css/bulma.css'

export class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: ""
        }
    }

    render() {
        return <div className="container">
            <div> Ingresa tu usuario </div>
            <div className="columns  is-centered">
                <div className="column is-three-fifths">
                    <input className="input" value={this.state.name} type="text" placeholder={"Usuario"}
                        onChange={(e => this.setState({ name: e.target.value }))} />
                </div>
            </div>
            <button className="button" onClick={() => this.props.reportNewUser(this.state.name)}>Button</button>
        </div>
    }
}