import { useState } from "react"; 
import { OktaAuth } from "@okta/okta-auth-js";
import { Input, Button, Form } from "antd";

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

import config from "../config";
import error from "../errors.constants";
import Register from "./Register";
import ReactDOM from "react-dom";
import Apis from "../Api.service";
import { ClientConfiguration } from "../models/Data.models";

function Login() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const emailPrefix = email.split('@')[0];
    const domain = email.split('@')[1];

    const validateEmail = async () => {
        Apis.getClientConfig(domain)
            .then((data: ClientConfiguration) => {
                //@ts-ignore
                if(!data.detail){
                    console.log('Auth profile: ', data);
                    config.oidc.clientId = data.portal_oidc_client_id;
                    config.oidc.issuer = data.base_url_oauth2;
                    localStorage.setItem("domain", domain);
                    localStorage.setItem("accountId", data.uid);
                    console.log("Account Id: ", localStorage.getItem("accountId"));
                    if (data.base_url_oauth2 !== "" && data.portal_oidc_client_id !== "") {
                        const oktaAuth = new OktaAuth(config.oidc);     
                        oktaAuth.signInWithRedirect({
                            originalUri: '/policies'
                        }).then((data) => {
                        }).catch((error) => {
                            console.log(error);
                        })
                    }
                    else {
                        ReactDOM.render(
                            <Register domain={domain}/>,
                            document.getElementById('root')
                        )
                    }
                }
                else{
                    //@ts-ignore
                    setErrorMessage(data.detail);
                    console.log(data);
                }
            }).catch((error) => {
                console.log(error);
            })
    }

    function handleSubmit() {
        if (email.length === 0) {
            setErrorMessage("");
            setMessage("Email is required");
        }
        else if (!email.includes('@') || emailPrefix === "" || domain === "" || !domain.includes('.') ||
            domain.split('.')[0] === "" || domain.split('.')[1] === "") {
            setErrorMessage("");
            setMessage("Please enter a valid email");
        }
        else {
            setMessage("");
            setErrorMessage("");
            validateEmail();
        }
    }

    function checkInvalid() {
        if ((email.length === 0 || !email.includes('@') || emailPrefix === "" || domain === "" ||
            !domain.includes('.') || domain.split('.')[0] === "" || domain.split('.')[1] === "") &&
            message.length !== 0) {
            return 'error';
        }
        return 'success';
    }

    return (
        <div style={{ height: '100vh', backgroundColor: 'whitesmoke' }} >
            <div id="login-container">
                <div style={{ paddingTop: '35px' }}>
                    <img src="https://op1static.oktacdn.com/fs/bco/1/fs0qzb42biQ2gLFj90h7" />
                </div>

                <div className="heading"><span>Login</span></div>
                
                <div style={{ color: 'red', textAlign: 'center', position: 'relative', top: '23px'}} >
                    {errorMessage}
                </div>

                <Form onFinish={handleSubmit} layout="vertical" 
                    style={{ textAlign: 'left', padding: '35px 35px 20px 35px' }}
                >
                    <Form.Item
                        label="Email"
                        validateStatus={checkInvalid()}
                        style={{marginBottom: '15px'}}
                    >
                        <Input 
                            style={{ borderRadius: '5px'}}
                            onChange={(e) => { setEmail(e.target.value) }} 
                            size="large"
                        />
                        <div style={{ color: 'red', textAlign: 'left' }}>{message}</div>
                    </Form.Item>

                    <Form.Item style={{marginBottom: '16px'}}>
                        <Button type="primary" className="submit-button" size="large"
                            htmlType="submit"
                        >
                            Next
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Login;
