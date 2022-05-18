import { Layout, Menu } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { OktaAuth } from "@okta/okta-auth-js";
import { useEffect, useState } from "react";

import './Layout.css';

import config from "../../config";
import ApiUrls, { productId } from '../../ApiUtils';
import ApiService from "../../Api.service";

const { SubMenu } = Menu;
const { Header } = Layout;

function AppHeader() {
    const history = useHistory();
    const { authState } = useOktaAuth();
    const [products, setProducts]: any = useState([]);

    useEffect(() => {
        ApiService.get(ApiUrls.getProducts)
            .then(data => {
                console.log(data);
                var object = {};
                for (var i = 0; i < data.length; i++) {
                    object[data[i].sku] = data[i].uid
                }
                if (!localStorage.getItem("productName")) {
                    localStorage.setItem("productId", object[data[0].sku])
                    localStorage.setItem("productName", data[0].sku)
                    window.location.reload();
                }
                setProducts(object);
            })
    }, [])

    console.log(products);

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
            localStorage.removeItem("productName");
            localStorage.removeItem("productId");
        }).catch((err) => {
            console.error(err)
        })
    };

    return (
        <Header className="header">
            <div className="logo">
                TecConnect
                {/* <img src="Credenti_Logo.png" alt="Credenti TecConnect"/> */}
            </div>

            <Menu className="border-bottom-0" theme="light" mode="horizontal"
                selectedKeys={[String(localStorage.getItem("productName"))]} onClick={(e) => {
                    Object.keys(products).map(product => {
                        console.log(e.key)
                        if (e.key === product) {
                            localStorage.setItem("productName", product)
                            localStorage.setItem("productId", products[product])
                            console.log(window.location.pathname.split('/').length)
                            // if (window.location.pathname.split('/').length >= 3) {
                            //     history.goBack();
                            // }
                            history.push("/dashboard");
                            window.location.reload()
                        }
                    })
                }}
            >
                {
                    Object.keys(products).map(product => {
                        return <Menu.Item key={product}>
                            {product.slice(0, 1).toUpperCase() + product.slice(1, 3).toLowerCase() + product.slice(3, 4).toUpperCase() + product.slice(4).toLowerCase()}
                        </Menu.Item>
                    })
                }
            </Menu>

            <Menu className="border-bottom-0" theme="light" mode="horizontal" id="logout-menu">
                <SubMenu title={authState?.idToken?.claims.name?.split(" ")[0]}
                    icon={<UserOutlined style={{ position: 'relative', bottom: '3px' }} />}
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
