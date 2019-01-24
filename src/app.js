import React, { Component } from "react";
import io from "socket.io-client";
import { Register } from "./components/register";
import { GameBoard } from "./components/gameboard";

const styles = {
  app: {
    paddingTop: 40,
    textAlign: "center"
  }
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      users: [],
      currentUser: null
    };
  }

  render() {
    console.log(`Users`, this.state.users);
    return (
      <div style={styles.app}>
        {this.state.users.indexOf(this.state.currentUser) === -1 ? (
          <Register
            reportNewUser={user => {
              console.log(`Nuevo Usuario: ${user}`);
              this.state.socket.emit("new user", user);
              this.setState({ currentUser: user });
            }}
          />
        ) : (
          <GameBoard users={this.state.users} />
        )}
      </div>
    );
  }

  componentDidMount() {
    const socket__ = io("http://localhost:3000");
    this.setState({ socket: socket__ });
    socket__.on("get users", data => {
      this.setState({ users: data });
      console.log("users from server: ", data);
    });
  }

  componentWillUnmount() {
    // socket.disconnect();
  }
}
