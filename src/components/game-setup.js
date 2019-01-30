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
      <div className="content">
        <p>
          {
            <strong> {this.state.buttonText === "Registrar" ? "Ingresa tu nombre de usuario" : "Bienvenido"} </strong>
          }
        </p>

        <div className="columns  is-centered" style={{ height: "70px" }}>
          {
            this.state.buttonText === "Registrar"
              ? <div className="column is-three-fifths">
                <input
                  className="input"
                  value={this.state.name}
                  type="text"
                  placeholder={"Usuario"}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </div>
              : <p> {this.props.currentUser} </p>
          }
        </div>
        <button
          className="button"
          onClick={() => {
            if (this.state.buttonText === "Registrar") {
              this.props.reportNewUser(this.state.name);
              this.setState({ buttonText: "Crear Partida" });
            } else {
              this.props.reportGameCreated();
            }
          }}
        >
          {this.state.buttonText}
        </button>
      </div>
    );
  }
}
