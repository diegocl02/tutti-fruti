import React, { Component } from "react";
import io from "socket.io-client";

const styles = {
  app: {
    paddingTop: 40,
    textAlign: "center"
  }
};

export class App extends Component {
  render() {
    return <div style={styles.app}>Welcome to React!</div>;
  }

  componentDidMount() {
    const socket = io("http://localhost:3000");
    // socket.on("FromAPI", data => this.setState({ response: data }));
  }

  componentWillUnmount() {
    // socket.disconnect();
  }
}
