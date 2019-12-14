import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { Card, Empty, Col, Icon, Row } from 'antd';

class VidCall extends Component {

    localStream;

    constructor(props) {
        super(props);
        this.state = {
            isCall: false,
            selfVideoStarted: true,
            selfAudioStarted: true
        }
    }

    componentDidMount() {
        this.startMyCam();
    }

    startMyCam = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            this.localStream = stream;
            this.refs.myvideo.srcObject = this.localStream;
        })
    }

    vidOff = () => {
        let index = this.localStream.getTracks().findIndex(track => {
            console.log(track.kind);
            if (track.kind == "video") {
                return 1;
            }
        })
        if (this.state.selfVideoStarted) {
            this.localStream.getTracks()[index].stop();
        } else {
            this.startMyCam()
        }
        this.setState({
            selfVideoStarted: !this.state.selfVideoStarted,
        })
    }

    placeCall = () => {
        let me = this;
        if (!this.state.isCall) {
            if (this.props.placeCall) {
                this.props.placeCall(this.localStream);
            }
        } else {
            me.setState({
                isCall: false,
            }, function () {
                if (this.props.cancelCall) {
                    this.props.cancelCall();
                }
            })
        }
    }

    audioOff = () => {
        let index = this.localStream.getTracks().findIndex(track => {
            console.log(track.kind);
            if (track.kind == "audio") {
                return 1;
            }
        })
        if (this.state.selfAudioStarted) {
            this.localStream.getTracks()[index].stop();
        } else {
            this.startMyCam()
        }
        this.setState({
            selfAudioStarted: !this.state.selfAudioStarted,
        })
    }

    handleRemoteStream = (remoteStream) => {
        if (remoteStream) {
            this.setState({
                isCall: true,
            }, function () {
                this.refs.remotevideo.srcObject = remoteStream;
            })
        } else {
            this.setState({
                isCall: false,
            })
        }
    }

    render() {
        return (
            <div style={{ position: "relative" }}>
                <Card style={{ margin: "20px", height: "79vh" }}>
                    <Row>
                        {this.state.isCall && <video style={{ minWidth: "100%", minHeight: "100%" }} ref="remotevideo" controls autoPlay></video>}
                        {<video ref="myvideo" style={{ transform: "rotateY(180deg)", minHeight: this.state.isCall ? "0%" : "100%", minWidth: this.state.isCall ? "0%" : "100%", height: this.state.isCall ? "100px" : "400px", width: this.state.isCall ? "100px" : "600px", position: this.state.isCall ? "absolute" : "relative", zIndex: 1 }} controls autoPlay ></video>}
                    </Row>
                    <Row style={{ marginTop: "8px" }}>
                        {/* <Col style={{ display: "flex", flex: 0.3, alignItems: "center" }}>
                            <div style={{ padding: "25px", height: "100px", width: "100px", borderRadius: "100px", border: "1px solid transparent", background: "#ba0009" }}>
                                <Icon onClick={() => {
                                    //this.vidOff()
                                }} type="camera" style={{ fontSize: "50px", color: "white" }}></Icon>
                            </div>
                        </Col> */}
                        <Col style={{ marginLeft: "45%", display: "flex", flex: 0.3, alignItems: "center" }}>
                            <div onClick={() => {
                                this.placeCall();
                            }} style={{ padding: "25px", height: "100px", width: "100px", borderRadius: "100px", border: "1px solid transparent", background: this.state.isCall ? "#ba0009" : "#01701d" }}>
                                <Icon type="phone" style={{ fontSize: "50px", color: "white" }}></Icon>
                            </div>
                        </Col>
                        {/* <Col style={{ display: "flex", flex: 0.3, alignItems: "center" }}>
                            <div style={{ padding: "25px", height: "100px", width: "100px", borderRadius: "100px", border: "1px solid transparent", background: "#ba0009" }}>
                                <Icon onClick={() => {
                                    //this.audioOff()
                                }} type="audio" style={{ fontSize: "50px", color: "white" }}></Icon>
                            </div>
                        </Col> */}
                    </Row>
                </Card>

            </div>
        );
    }
}

export default VidCall;
