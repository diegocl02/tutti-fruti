import React, { Component } from "react";

import "bulma/css/bulma.css";

export class GameSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      buttonText: "Registrar"
    };
  }

  render() {
    return (
      <div className="container">
        <div> Ingresa tu usuario </div>
        <div className="columns  is-centered">
          <div className="column is-three-fifths">
            <input
              className="input"
              value={this.state.name}
              type="text"
              placeholder={"Usuario"}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </div>
        </div>
        <button
          className="button"
          onClick={() => {
            if (this.state.buttonText === "Registrar") {
              this.props.reportNewUser(this.state.name);
              this.setState({ buttonText: "Comenzar Tutti" });
            } else {
              this.props.reportGameStart();
            }
          }}
        >
          {this.state.buttonText}
        </button>
      </div>
    );
  }
}
