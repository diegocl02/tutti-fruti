import React, { Component } from "react";
import io from "socket.io-client";
import { GameSetup } from "./components/game-setup";
import { GameBoard } from "./components/gameboard";
import { RoomsList } from "./components/rooms-list";

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
      gameStarted: false,
      rooms: [],
      letter: null,
      gameOver: false 
    };
  }

  render() {
    return (
      <div style={styles.app} className={"container"}>
        {!this.state.gameStarted ? (
          <div className={"container"}>
            <section className={"section"}>
              <GameSetup
                currentUser={this.state.currentUser}
                reportNewUser={user => {
                  console.log(`Nuevo Usuario: ${user}`);
                  this.state.socket.emit("new user", user);
                  this.setState({ currentUser: user });
                }}
                reportGameCreated={() => {
                  this.state.socket.emit("create game", "room test")
                  this.setState({
                    gameStarted: true
                  });
                }}
              />
            </section>

            { this.state.currentUser!== "" ? <section className={"section"}>
              <RoomsList rooms={this.state.rooms} reportRoomJoined={(room) => {
                this.state.socket.emit("enter room", room)
                this.setState({gameStarted: true})
              }}/>
            </section> : null}
          </div>
        ) : (
            <GameBoard
              users={this.state.userMoves}
              user={this.state.currentUser}
              onChange={change => {
                this.state.socket.emit("send tutti", change.type, change.content);
              }}
              reportReady={()=> {
                this.state.socket.emit("set ready")
              }}
              letter={this.state.letter}
              gameOver={this.state.gameOver}
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
    
    // this.setState({ users });
  }

  handleNewRooms(rooms){
    this.setState({rooms})
  }

  handleUserJoined(user){
    console.log("User joined", user)
    let emptyEntry = { animal: null, country: null, object: null, color: null, name: null }

    this.setState({userMoves:[...this.state.userMoves,{ username: user, play: { ...emptyEntry } }]});
  }

  handleRoomUsers(roomUsers){
    let emptyEntry = { animal: null, country: null, object: null, color: null, name: null }

    this.setState({userMoves: [...roomUsers.map(user => {
      return {username: user, play: {...emptyEntry}}
    })]});
  }

  handleNewLetter(letter){
    this.setState({letter})
  }

  handleGameOver(){
    this.setState({gameOver: true})
  }

  componentDidMount() {
    const socket = io("http://192.168.0.74:3000");
    this.setState({ socket: socket });

    // Socket listeners
    socket.on("get users", data => {
      this.handleGetUsers(data);
      console.log("users from server: ", data);
    });

    socket.on("new tutti", data => {
      this.handleNewTutti(data);
    });

    socket.on("get gamerooms", rooms => {
      this.handleNewRooms(rooms)
    })

    socket.on("user joined", user => {
      this.handleUserJoined(user)
    })

    socket.on("get room users", roomUsers => {
      this.handleRoomUsers(roomUsers)
    })

    socket.on("game letter", letter => {
      this.handleNewLetter(letter)
    })

    socket.on("game over", () => {
      this.handleGameOver()
    })
  }

  componentWillUnmount() {
    // socket.disconnect();
  }
}
