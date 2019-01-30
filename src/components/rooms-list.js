import React, { Component } from "react";

import "bulma/css/bulma.css";

export class RoomsList extends Component {
    render() {
        return <div className="content">
            <div className="columns">
                <div className="column is-half content is-offset-one-quarter" style={{ border: "thin solid" }}>
                    <p> <strong> Unete a una Sala: </strong> </p>
                    {
                        this.props.rooms.map(room => {
                            return <div 
                                className="notification is-primary"
                                onClick={()=> {this.props.reportRoomJoined(room)}}
                                > 
                                {room}
                                </div>
                        })
                    }
                </div>
            </div>
        </div>
    }
}