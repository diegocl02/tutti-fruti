import React, { Component } from "react";

import "bulma/css/bulma.css";

export class GameBoard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table>
        <thead>
          <tr>Users:</tr>
        </thead>
        <tbody>
          {this.props.users.map(user => (
            <tr>
              <td>{user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
