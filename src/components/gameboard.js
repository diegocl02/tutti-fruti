import React, { Component } from "react";

import 'bulma/css/bulma.css'

export class GameBoard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
            return <table>
                <tr>
                {this.props.users.map(user => <td>Jill</td>)}
                </tr>
            </table>
    }
}