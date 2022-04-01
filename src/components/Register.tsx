import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Input, Button, Form, Select } from "antd";

import './Register.css';

import Apis from '../Api.service';
import Login from "./Login";

const Register = (props: { domain: any; }) => {
    const server = "https://";
    const [domainName, setDomainName] = useState("");
    const [value, setValue] = useState("okta.com");
    const [message, setMessage] = useState("");

    const [details, setDetails] = useState(
        {
            clientId: "",
            authServerId: "",
            domain: ""
        }
    );

    useEffect(() => {
        setDomainName(props.domain);
    }, [props.domain])

    function register() {
        const tenantUrl = server + details.domain + "." + value;
            Apis.updateClientConfig(tenantUrl, details.authServerId, domainName, details.clientId)
            .then(data => {
                if (!data.errorCode) {
                    if (data.status === 'SUCCESS') {
                        ReactDOM.render(
                            <Login />,
                            document.getElementById("root")
                        )
                    }
                }
                else {
                    console.log(data)
                }
            })
            .catch(error => {
                console.log(error);
            })
    }

    const handleSubmit = () => {
        if (details.clientId.length === 0 || details.authServerId.length === 0 || details.domain.length === 0) {
            setMessage("All fields are required");
        }
        else {
            setMessage("");
            register();
        }
    }

    function checkInput(name: string) {
        if (name.length === 0 && message.length !== 0) {
            return 'error';
        }
        return 'success';
    }

    function showLoginScreen() {
        ReactDOM.render(
            <Login />,
            document.getElementById("root")
        )
    }

    return (
        <div style={{ height: '100vh', backgroundColor: 'whitesmoke' }} >
            <div className="form-container" >
                <div className="form-heading" >
                    Registration
                </div>

                <div style={{ color: 'red', textAlign: 'center', position: 'relative', bottom: '6px' }} >
                    {message}
                </div>

                <Form onFinish={handleSubmit} layout="vertical" style={{ textAlign: 'left' }}>
                    <Form.Item
                        label="Client Id"
                        tooltip={{
                            title: "Your okta authorization client Id",
                            placement: "right"
                        }}
                        validateStatus={checkInput(details.clientId)}
                    >
                        <Input autoFocus
                            style={{ borderRadius: '5px' }}
                            onChange={(e) => {
                                setDetails(details => ({
                                    ...details,
                                    clientId: e.target.value
                                }))
                            }}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Authorization Server ID"
                        tooltip={{
                            title: "Your okta authorization server Id",
                            placement: "right"
                        }}
                        validateStatus={checkInput(details.authServerId)}
                    >
                        <Input
                            style={{ borderRadius: '5px' }}
                            onChange={(e) => {
                                setDetails(details => ({
                                    ...details,
                                    authServerId: e.target.value
                                }))
                            }}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Tenant URL"
                        tooltip={{
                            title: "tenant Url(ex: tecnics-dev for https://tecnics-dev.okta.com)",
                            placement: "right"
                        }}
                        validateStatus={checkInput(details.domain)}
                    >
                        <Input
                            addonBefore={
                                <Form.Item noStyle>
                                    <label>
                                        {server}
                                    </label>
                                </Form.Item>
                            }
                            addonAfter={
                                <Form.Item noStyle>
                                    <Select className="select-after"
                                        value={value}
                                        onChange={(value) => setValue(value)}
                                        style={{ width: '150px', textAlign: 'left' }}
                                    >
                                        <Select.Option value="okta.com">okta.com</Select.Option>
                                        <Select.Option value="oktapreview.com">oktapreview.com</Select.Option>
                                    </Select>
                                </Form.Item>
                            }
                            onChange={(e) => {
                                setDetails(details => ({
                                    ...details,
                                    domain: e.target.value
                                }))
                            }}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item style={{
                        marginBottom: '2px', marginTop: '0px', position: 'relative', 
                        bottom: '6px'}}
                    >
                        <Button type="primary" className="submit-button" size="large" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                
                <div style={{ textAlign: 'right', marginTop: '15px', marginBottom: '-10px' }}>
                    <a onClick={() => showLoginScreen()}>
                        Back to login
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Register;
