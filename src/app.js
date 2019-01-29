import React, { Component } from "react";
import io from "socket.io-client";
import { GameSetup } from "./components/game-setup";
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
      users: [], // [ "username1", "username2" ]
      userMoves: [], // [ { username: socket.username, play: { emptyEntry } } ]
      currentUser: "",
      gameStarted: false
    };
  }

  render() {
    return (
      <div style={styles.app}>
        {!this.state.gameStarted ? (
          <GameSetup
            reportNewUser={user => {
              console.log(`Nuevo Usuario: ${user}`);
              this.state.socket.emit("new user", user);
              this.setState({ currentUser: user });
            }}
            reportGameStart={() => {
              let emptyEntry = { animal: null, object: null, color: null };
              this.setState({
                userMoves: this.state.users.map(user => {
                  return { username: user, play: { ...emptyEntry } };
                }),
                gameStarted: true
              });
            }}
          />
        ) : (
          <GameBoard
            users={this.state.userMoves}
            user={this.state.currentUser}
            onChange={change => {
              this.state.socket.emit("send tutti", change.type, change.content);
            }}
          />
        )}
      </div>
    );
  }

  // user
  // [..., {username, play: {animal, country, objects} }]

  handleNewTutti(data) {
    console.log("HandleNewTutti: new tutti ", data);
    let userMoves = [...this.state.userMoves];
    let user = {
      ...userMoves.find(user => data.username === user.username)
    };
    const userIndex = this.state.userMoves.findIndex(
      user => data.username === user.username
    );
    user.play[data.type] = data.content;

    userMoves[userIndex] = user;
    this.setState({
      userMoves: userMoves
    });
  }

  // {username, animal, country, objects}
  handleGetUsers(users) {
    // console.log('HandleGetUsers: new users ', data)
    // const newUsers = data.filter(user => this.state.users.findIndex(u => user === u.username) === -1)
    // console.log('NEW USERs', newUsers)
    this.setState({ users });
  }

  componentDidMount() {
    const socket = io("http://localhost:3000");
    this.setState({ socket: socket });

    // Socket listeners
    socket.on("get users", data => {
      this.handleGetUsers(data);
      console.log("users from server: ", data);
    });

    socket.on("new tutti", data => {
      this.handleNewTutti(data);
    });
  }

  componentWillUnmount() {
    // socket.disconnect();
  }
}
