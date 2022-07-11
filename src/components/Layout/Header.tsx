import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { OktaAuth } from "@okta/okta-auth-js";
import { Layout, Menu } from "antd";
import { UserOutlined } from '@ant-design/icons';

import './Layout.css';

import { openNotification } from "./Notification";
import ApiUrls from '../../ApiUtils';
import ApiService from "../../Api.service";
import config from "../../config";
import { Directory, MenuItemPaths, productNames, Products, Settings, TecBio, TecBIO, TecTango, TecTANGO, TecUNIFY } from "../../constants";
import { Store } from "../../Store";

const { SubMenu } = Menu;
const { Header } = Layout;

function AppHeader() {
    let emptyObj = {};
    const history = useHistory();
    const [selectedMenuOption, setSelectedMenuOption] = useContext(Store);
    const { authState, oktaAuth } = useOktaAuth();
    const [products, setProducts] = useState(emptyObj);
    
    let selectedHeaderKeys: any = [selectedMenuOption];
    if (Object.keys(productNames).includes(selectedMenuOption)) {
        selectedHeaderKeys = [Products].concat([selectedMenuOption]);
    }

    const directoryPaths = ['dashboard', '/users', '/groups', '/machines', '/devices'];
    const commonProductPaths = ['/product', '/mechanism', '/policies', '/activitylogs'];
    const settingsPaths = ['/account', '/domains', '/global-policies'];

    const headerItemsInitialValue = [
        {
            label: Directory,
            key: Directory
        },
        {
            label: Products,
            key: Products,
            children: []
        },
        {
            label: Settings,
            key: Settings
        }
    ];

    const [headerItems, setHeaderItems] = useState(headerItemsInitialValue);

    useEffect(() => {
        ApiService.get(ApiUrls.account_info, { domain: localStorage.getItem('domain')})
            .then(data => {
                getProducts(data.uid);
                localStorage.setItem('accountId', data.uid);
            })
    }, []);

    useEffect(() => {
        if (products !== emptyObj) {
            setHeaderItems(state => {
                const values = state;
                let productKeys = Object.keys(products);

                values.forEach(value => {
                    if (value.label === Products) {
                        // @ts-ignore
                        values[values.indexOf(value)].children = [...productKeys.map(productKey => {
                            return {
                                label: productNames[productKey],
                                key: productKey
                            }
                        })];
                    }
                });
                return JSON.parse(JSON.stringify(values));
            });
        }

        const splitPath = window.location.pathname?.split("/");
        console.log({ splitPath });

        if (splitPath?.length) {
            console.log(window.location.pathname);
            if (directoryPaths.some(path => window.location.pathname.includes(path))) {
                console.log({ Directory });
                setSelectedMenuOption(Directory);
            }
            else if (settingsPaths.some(path => window.location.pathname.includes(path))) {
                setSelectedMenuOption(Settings);
            }
            else if (commonProductPaths.some(path => window.location.pathname.includes(path))) {
                let product = Object.keys(products).find(key => {
                    console.log(products[key]);
                    console.log(splitPath[2]);
                    return products[key] === splitPath[2]
                });
                console.log({ splitPath });
                console.log({ products });
                console.log({ product });
                if (product) {
                    setSelectedMenuOption(product);
                }
            }
        }

    }, [products]);

    function getProducts(accountId) {
        ApiService.get(ApiUrls.products(accountId))
            .then(data => {
                if (!data.errorSummary) {
                    var object = emptyObj;
                    for (var i = 0; i < data.length; i++) {
                        object[data[i].sku] = data[i].uid
                    }
                    if (!localStorage.getItem("productName")) {
                        localStorage.setItem("productId", object[data[0].sku])
                        localStorage.setItem("productName", data[0].sku)
                        window.location.reload();
                    }
                    setProducts({ ...object });
                }
            })
            .catch((error) => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with getting Products');
            })
    }

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

    if (oktaAuth.getIdToken() === undefined && oktaAuth.getAccessToken() === undefined) {
        logout();
    }

    function headerMenuClickHandler(e) {
        setSelectedMenuOption(e.key);
        localStorage.setItem("productId", products[e.key]);
        console.log(e.key);
        console.log(MenuItemPaths[e.key]);
        switch (e.key) {
            case Directory:
                history.push(`${MenuItemPaths[e.key]}`);
                break;
            case Settings:
                history.push(`${MenuItemPaths[e.key]}`);
                break;
            default:
                history.push(`/product/${products[e.key]}${MenuItemPaths[e.key]}`);
        }
    }

    return (
        <Header className="header">
            <div className="logo">
                <img src={ window.location.origin + "/Credenti_Logo.png" } alt="Credenti TecConnect" width={150} />
            </div>

            <Menu className="border-bottom-0" theme="light" mode="horizontal"
                selectedKeys={selectedHeaderKeys} onClick={headerMenuClickHandler}
                items={headerItems}
            />

            <Menu className="border-bottom-0" theme="light" mode="horizontal" id="logout-menu">
                <SubMenu title={//@ts-ignore
                    oktaAuth.authStateManager._authState?.idToken?.claims.name.split(" ")[0]}
                    icon={<UserOutlined />}
                    key={'sub'}
                >
                    <Menu.Item key="name" className="menu-item-disabled"
                        style={{ userSelect: 'text' }} disabled
                    >
                        <p style={{ fontWeight: 600, fontSize: 'medium', position: 'relative', top: '8px', padding: '0px 0px 0px 10px' }}>
                            {oktaAuth.authStateManager._authState?.idToken?.claims.name}
                        </p>
                    </Menu.Item>

                    <Menu.Item key="email" className="menu-item-disabled" style={{
                        userSelect: 'text',
                        color: 'black', padding: '0px 30px 0 26px', marginTop: '-10px'
                    }}
                        disabled
                    >
                        {oktaAuth.authStateManager._authState?.idToken?.claims.email}
                    </Menu.Item>

                    <Menu.Item key="logout" onClick={logout} style={{
                        marginTop: '-16px',
                        padding: '0 0 30px 27px'
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
