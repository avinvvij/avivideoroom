import React, { Component, useState } from 'react';
import { Affix, PageHeader, Input, Icon, Row, Button, Col } from 'antd';


function AppBar(props) {

    const [otherPeerID, setOtherPeerId] = useState("");

    return (
        <Affix>
            <div style={{ background: "white" }}>
                <PageHeader
                    style={{
                        border: '1px solid rgb(235, 237, 240)',
                    }}
                    title="Avii Video Room"
                    subTitle={"Your ID: " + (props.peerId || "")}
                    extra={[
                        <Input placeholder="User Id" addonAfter={<Icon onClick={() => {
                            if (props.connectToPeer) {
                                props.connectToPeer(otherPeerID)
                            }
                        }} type="api"></Icon>} onChange={(event) => {
                            setOtherPeerId(event.target.value)
                        }} />
                    ]}
                />
                <div style={{ backgroundColor: props.connectionStatus == "Connected" ? "#007c89" : "#8a0822", height: "50px", paddingTop: "10px", paddingLeft: "25px" }}>
                    <Row>
                        <Col lg={20}>
                            <Row align="middle" justify="center">
                                <label style={{ color: "#AFAFAF", fontSize: "12px" }}>{"Connection Status: "}</label>
                                <label style={{ color: "white", fontSize: "16px", marginLeft: "8px" }}>{props.connectionStatus}</label>
                                {props.connectionStatus == "Connected" && <label style={{ color: "white", fontSize: "16px", marginLeft: "8px" }}>{"To " + props.otherPeerId}</label>}
                            </Row>
                        </Col>
                        <Col lg={4}>
                            <Row justify="end">
                                {props.connectionStatus == "Connected" && <Button onClick={() => {
                                    if (props.onDisconnect) {
                                        props.onDisconnect();
                                    }
                                }} style={{ marginLeft: "8px" }} ghost>Disconnect</Button>}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </Affix >
    );
}

export default AppBar;

