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
      currentUser: ""
    };
  }

  render() {
    console.log(`Users`, this.state.users, this.state.currentUser);
    console.log(this.state.users.find(user => user.username === this.state.currentUser))
    return (
      <div style={styles.app}>
        {this.state.users.find(user => user.username === this.state.currentUser) === undefined
        ? (
          <Register
            reportNewUser={user => {
              console.log(`Nuevo Usuario: ${user}`);
              this.state.socket.emit("new user", user);
              this.setState({ currentUser: user });
            }}
          />
        ) : (
            <GameBoard users={this.state.users} user={this.state.currentUser} onChange={change => {
              this.state.socket.emit("send tutti", change.type, change.content)
            }}/>
          )}
      </div>
    );
  }

  // user
  // [..., {username, play: {animal, country, objects} }]

  handleNewTutti(data) {
    console.log('HandleNewTutti: new tutti ', data)
    const user = this.state.users.find(user => data.username === user.username)
    const userIndex = this.state.users.findIndex(user => data.username === user.username)
    user.play[data.type] = data.content

    const newUsers = [...this.state.users]
    newUsers[userIndex] = user
    this.setState({
      users: newUsers
    })

  }

  // {username, animal, country, objects}
  handleGetUsers(data) {
    console.log('HandleGetUsers: new users ', data)
    const newUsers = data.filter(user => this.state.users.findIndex(u => user === u.username) === -1)
    console.log('NEW USERs', newUsers)
    this.setState({
      users: [...this.state.users, ...newUsers.map(user => { return { username: user, play: {} } })]
    })
  }

  componentDidMount() {
    const socket = io("http://localhost:3000");
    this.setState({ socket: socket });

    // Socket listeners
    socket.on("get users", data => {
      this.handleGetUsers(data)
      console.log("users from server: ", data);
    });

    socket.on("new tutti", data => {
      this.handleNewTutti(data)
    })
  }

  componentWillUnmount() {
    // socket.disconnect();
  }
}
