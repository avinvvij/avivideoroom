import React, { Component } from 'react';
import { Input, Icon, Empty } from 'antd';

class ChatSection extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            messages: []
        }
    }

    componentDidMount() {

    }

    onSendMessage = () => {
        if (this.state.message.trim() != "") {
            let me = this;
            let _messages = Object.assign([], this.state.messages);
            _messages.push({
                isSender: true,
                message: this.state.message
            })
            if (this.props.sendMessage) {
                this.props.sendMessage(this.state.message);
            }
            this.refs.chatmessages.scrollTop = this.refs.chatmessages.scrollHeight;
            me.setState({
                message: "",
                messages: _messages
            }, function () {

            })
        }
    }

    onMessageReceived = (msg) => {
        let me = this;
        let _messages = Object.assign([], this.state.messages);
        _messages.push({
            isSender: false,
            message: msg
        })
        this.refs.chatmessages.scrollTop = this.refs.chatmessages.scrollHeight;
        me.setState({
            messages: _messages
        })
    }

    renderMessages = () => {
        let me = this;
        return me.state.messages.map(message => {
            if (message.isSender) {
                return (
                    <div style={{ display: "flex", marginTop: "8px", justifyContent: 'flex-end', position: "relative" }}>
                        <label style={{ zIndex: "1", maxWidth: "250px", overflow: "auto", textOverflow: "auto", marginRight: "5px", wordBreak: "break-word", borderRadius: "8px", border: "0.5px solid transparent", background: "#519eff", padding: "8px", alignSelf: "flex-end" }}>{message.message}</label>
                    </div>
                )
            } else {
                return (
                    <div style={{ display: "flex", marginTop: "8px", justifyContent: 'flex-start' }}>
                        <label style={{ zIndex: "1", maxWidth: "250px", overflow: "auto", textOverflow: "auto", wordBreak: "break-word", borderRadius: "8px", border: "0.5px solid transparent", background: "#807d6a", padding: "8px", alignSelf: "flex-end" }}>{message.message}</label>
                    </div>
                )
            }
        })
    }

    render() {
        return (
            <div style={{ flexDirection: "column", display: "flex", height: "82vh", backgroundColor: "#fafafa", borderLeft: "0.5px solid #a8a8a8" }}>
                <div style={{ display: "flex", flex: 0.02, paddingLeft: "10px", paddingTop: "5px" }}>
                    <h4>Chat Here</h4>                    
                </div>
                <div style={{ display: "flex", flex: 0.93, flexDirection: "column", maxHeight: "77vh", /*background: "url('" + require("../assets/doodlechat.jpg") + "'" */ }}>
                    <div style={{ width: '100%', borderTop: "0.2px solid #a8a8a8", flex: 0.01 }}></div>
                    <div style={{ maxHeight: "70vh", overflow: "hidden", display: "flex", flex: 0.99, flexDirection: "column", paddingLeft: "10px", paddingRight: "10px", justifyContent: "flex-end" }}>
                        {this.state.messages.length <= 0 && <Empty description={"No Messages"}></Empty>}
                        <div ref="chatmessages" style={{ display: "block", overflow: "auto" }}>
                            {this.renderMessages()}
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", flex: 0.05, padding: "8px" }}>
                    <Input value={this.state.message} onKeyPress={(event) => {
                        if (event.key == "Enter") {
                            this.onSendMessage();
                        }
                    }} placeholder="Enter Message" onChange={(event) => {
                        this.setState({
                            message: event.target.value
                        })
                    }} addonAfter={
                        <Icon type="message" onClick={() => {
                            this.onSendMessage();
                        }}></Icon>
                    } />
                </div>
            </div>
        );
    }
}

export default ChatSection;
