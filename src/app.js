import React, { Component } from 'react'

const styles = {
  app: {
    paddingTop: 40,
    textAlign: 'center',
  },
}

export class App extends Component {
  render() {
    return (
      <div style={styles.app}>
        Welcome to React!
      </div>
    )
  }
}