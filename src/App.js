import React from 'react';
import logo from './logo.svg';
import './App.css';
import VidCall from './Components/VidCall';
import 'antd/dist/antd.css';
import AppBar from './CommonComponents/AppBar';
import Peer from 'peerjs';
import { Row, Col, notification, Button } from 'antd';
import ChatSection from './Components/ChatSection';
import { peerconfig } from './secret_conf';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      peer: "",
      otherPeerId: "",
      connectionStatus: "Not Connected",
      connection: null,
      remoteStream: null,
      incomingCall: false,
      currentCall: null,
    }
  }

  componentDidMount() {
    let me = this;
    let mypeer = this.state.peer;
    if (this.state.peer == "") {
      mypeer = new Peer(window.location.hash.replace("#", "") || null, peerconfig);
    }

    mypeer.on("open", (id) => {
      this.setState({
        peer: mypeer
      })
    });

    mypeer.on("error", (error) => {
      alert(error.message);
    })

    mypeer.on("close", () => {
      this.setState({ connectionStatus: "Disconnected", connection: null, otherPeerId: "" })
    })

    mypeer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        notification.info({
          message: "Incoming call : " + this.state.otherPeerId,
          duration: null,
          key: "callnoti",
          btn: <Button type="primary" size="small" onClick={() => {
            call.answer(stream); this.setState({
              currentCall: call
            }); notification.close("callnoti")
          }}>
            Answer
        </Button>,
          description: "There is an incoming call from : " + this.state.otherPeerId,
          onClose: () => {
            call.close();
          }
        })

        call.on('stream', (remoteStream) => {
          this.setState({
            remoteStream: remoteStream
          }, function () {
            this.refs.videocall.handleRemoteStream(remoteStream);
          })
        })

        call.on('close', () => {
          notification.error({
            title: "Call Disconnected",
            description: "Call disconnected with " + this.state.otherPeerId
          })
          this.refs.videocall.handleRemoteStream(null);
        })

      })
    })

    mypeer.on("connection", (con) => {
      if (!me.state.connection) {
        me.setState({
          connection: con,
          otherPeerId: con.peer,
          connectionStatus: "Connected"
        }, function () {
          this.assignConnectionCallbacks();
        })
      } else {
        con.send("Already Connected");
        con.close();
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
  }

  placeCall = (stream) => {
    console.log(this.state);
    const call = this.state.peer.call(this.state.otherPeerId, stream);
    this.setState({
      currentCall: call
    })
    call.on('stream', (remoteStream) => {
      notification.success({
        title: "Call Started",
        description: "Call Started with " + this.state.otherPeerId
      })
      this.setState({
        remoteStream: remoteStream
      }, function () {
        this.refs.videocall.handleRemoteStream(remoteStream);
      })
    })

    call.on('close', () => {
      notification.error({
        title: "Call Disconnected",
        description: "Call disconnected with " + this.state.otherPeerId
      })
      this.refs.videocall.handleRemoteStream(null);
    })
  }


  connectToPeer = (peerId) => {
    let newconnection = this.state.peer.connect(peerId, { reliable: true });
    this.setState({
      connectionStatus: "Connecting...",
      connection: newconnection,
    }, function () {
      this.state.connection.on("open", () => {
        // this.state.connection.send("Hey we connected");
        console.log("Connection Successfull");
        this.setState({
          otherPeerId: peerId,
          connectionStatus: "Connected"
        }, function () {
          this.assignConnectionCallbacks();
        })
      })
    });
  }

  assignConnectionCallbacks = () => {

    console.log("Connection callbacks");
    console.log(this.state.connection);

    let me = this;
    this.state.connection.on("close", () => {
      me.setState({
        connectionStatus: "Disconnected",
        otherPeerId: "",
        connection: ""
      })
    });

    this.state.connection.on("data", (data) => {
      console.log(data);
      this.refs.chatmsgsec.onMessageReceived(data);
    });

  }

  render() {
    return (
      <div>
        <AppBar onDisconnect={() => {
          this.state.connection.close();
        }} connectionStatus={this.state.connectionStatus} otherPeerId={this.state.otherPeerId || ""} connectToPeer={this.connectToPeer} peerId={this.state.peer && this.state.peer.id ? this.state.peer.id : ""}></AppBar>
        <Row>
          <Col xs={24} sm={24} md={12} lg={18}><VidCall cancelCall={() => {
            this.state.currentCall.close();
          }} ref="videocall" placeCall={this.placeCall} remoteStream={this.state.remoteStream}></VidCall></Col>
          <Col xs={24} sm={24} md={12} lg={6}><ChatSection sendMessage={(message) => {
            this.state.connection.send(message);
          }} ref="chatmsgsec"></ChatSection></Col>
        </Row>
      </div >
    )
  }

}

export default App;
