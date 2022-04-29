import { Layout, Menu } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { OktaAuth } from "@okta/okta-auth-js";

import './Layout.css';

import config from "../../config";

const { SubMenu } = Menu;
const { Header } = Layout;

function AppHeader() {
    const history = useHistory();
    const { authState } = useOktaAuth();

    const logout = async () => {
        const basename = window.location.origin + history.createHref({ pathname: '/' });

        config.oidc.clientId = String(localStorage.getItem("clientId"));
        config.oidc.issuer = String(localStorage.getItem("issuer"));

        const oktaAuth = new OktaAuth(config.oidc);

        oktaAuth.signOut({
            postLogoutRedirectUri: basename
        }).then(data => {
            localStorage.removeItem("clientId");
            localStorage.removeItem("issuer");
            localStorage.removeItem("domain");
            localStorage.removeItem("policyUid");
            localStorage.removeItem("mechanismUid");
            localStorage.removeItem("companyName");
            localStorage.removeItem("accountId");
        }).catch((err) => {
            console.error(err)
        })
    };

    function openScreen(screen: string) {
        history.push('/' + screen);
    }

    return (
        <Header className="header">
            <div className="logo">
                TecConnect
            </div>
            
            <Menu className="border-bottom-0" theme="light" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">TecTango</Menu.Item>
                <Menu.Item key="2" onClick={(e) => openScreen("tecunify")}>TecUnify</Menu.Item>
            </Menu>

            <Menu className="border-bottom-0" theme="light" mode="horizontal" id="logout-menu">
                <SubMenu title={authState?.idToken?.claims.name?.split(" ")[0]} 
                    icon={<UserOutlined style={{position: 'relative', bottom: '3px'}} />}
                    key={'sub'}
                >
                    <Menu.Item key="name" className="menu-item-disabled"
                        style={{ userSelect: 'text' }} disabled
                    >
                        <h6 style={{ position: 'relative', top: '8px', padding: '10px 0px 0px 10px' }}>
                            {authState?.idToken?.claims.name}
                        </h6>
                    </Menu.Item>
            
                    <Menu.Item key="email" className="menu-item-disabled" style={{
                        userSelect: 'text',
                        color: 'black', padding: '0px 30px 0 26px', marginTop: '-10px'
                    }}
                        disabled
                    >
                        {authState?.idToken?.claims.email}
                    </Menu.Item>
            
                    <Menu.Item key="logout" onClick={logout} style={{
                        marginTop: '-16px',
                        padding: '0 0 30px 26px'
                    }}
                    >
                        {'Logout'}
                    </Menu.Item>
                </SubMenu>
            </Menu>
        </Header>
    );
}

export default AppHeader;
