import { useContext, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { OktaAuth } from "@okta/okta-auth-js";
import { Input, Button, Form } from "antd";
import { useOktaAuth } from "@okta/okta-react";

import './Login.css';

import Register from "./Register";
import ApiUrls from '../ApiUtils';
import ApiService from "../Api.service";
import config from "../config";
import { Directory } from "../constants";
import { ClientConfiguration } from "../models/Data.models";
import { Store } from "../Store";

function Login() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const emailPrefix = email.split('@')[0];
    const domain = email.split('@')[1];
    const [, setSelectedHeader] = useContext(Store);
    const { authState, oktaAuth } = useOktaAuth();
    const history = useHistory();
    const [buttonLoading, setButtonLoading] = useState(false);

    const validateEmail = async () => {
        setButtonLoading(true);
        ApiService.post(ApiUrls.client_info, { domain: domain })
            .then((data: ClientConfiguration) => {
                //@ts-ignore
                if (!data.errorSummary) {
                    console.log('Auth profile: ', data);
                    config.oidc.clientId = data.idp_portal_oidc_client_id;
                    config.oidc.issuer = data.issuer_url;
                    localStorage.setItem("domain", domain);
                    localStorage.setItem("clientId", data.idp_portal_oidc_client_id);
                    localStorage.setItem("issuer", data.issuer_url);
                    if (data.issuer_url !== "" && data.idp_portal_oidc_client_id !== "") {
                        const oktaAuth = new OktaAuth(config.oidc);
                        oktaAuth.signInWithRedirect({
                            originalUri: '/dashboard',
                            loginHint: email
                        }).then((data) => {
                            setSelectedHeader(Directory);
                        }).catch((error) => {
                            console.error(error);
                        })
                    }
                    else {
                        ReactDOM.render(
                            <Register domain={domain} />,
                            document.getElementById('root')
                        )
                    }
                    setButtonLoading(false);
                }
                else {
                    //@ts-ignore
                    setErrorMessage("Login failed due to an internal error");
                    setButtonLoading(false);
                    console.error(data);
                }
            }).catch((error) => {
                setErrorMessage(error.message + ". Please contact Admin");
                setButtonLoading(false);
                console.error(error);
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
        !authState ? null : authState && authState.isAuthenticated ? <>{history.push('/dashboard')}</> :
            <div style={{ height: '100vh', backgroundColor: 'whitesmoke' }} >
                <div id="login-container">
                    <div style={{ paddingTop: '35px' }}>
                        <img src="Credenti_Logo.png" alt="Credenti TecConnect" width={250} />
                    </div>

                    <div className="heading"><span>Login</span></div>

                    <div style={{ color: 'red', textAlign: 'center', position: 'relative', top: '23px' }} >
                        {errorMessage}
                    </div>

                    <Form onFinish={handleSubmit} layout="vertical"
                        style={{ textAlign: 'left', padding: '35px 35px 20px 35px' }}
                    >
                        <Form.Item
                            label="Email"
                            validateStatus={checkInvalid()}
                            style={{ marginBottom: '15px' }}
                        >
                            <Input
                                style={{ borderRadius: '5px' }}
                                autoFocus
                                onChange={(e) => { setEmail(e.target.value.split(" ").join("")) }}
                                size="large"
                            />
                            <div style={{ color: 'red', textAlign: 'left' }}>{message}</div>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: '16px' }}>
                            <Button type="primary" loading={buttonLoading} className="submit-button" size="large"
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
