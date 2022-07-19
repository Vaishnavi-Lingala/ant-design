import { useHistory } from 'react-router-dom';
import { BarsOutlined, MenuOutlined, PoweroffOutlined, StopOutlined } from "@ant-design/icons";

import ApiService from "../../Api.service";
import { LocalUserProvisioningPolicyDescription, LOCAL_USER_PROVISIONING, policyDisplayNames, VDI_Description, VIRTUAL_DESKTOP_INTERFACE } from "../../constants";
import { openNotification } from "../Layout/Notification";
import ApiUrls from '../../ApiUtils';
import { useContext, useEffect, useState } from "react";
import { Store } from "../../Store";
import { Button, Skeleton, Tabs, Tooltip } from "antd";
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import ProtectedRoute from '../ProtectedRoute';
import UserProvisioningPolicy from './UserProvisioningPolicy';
import VDIPolicy from './VirtualDesktopInterface';
import TableList from './tableList';

function GlobalPolicies() {
    const history = useHistory();
    const [seletedProduct] = useContext(Store);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeUserProvisioningPolicies, setActiveUserProvisioningPolicies]: any = useState([]);
    const [inActiveUserProvisioningPolicies, setInActiveUserProvisioningPolicies] = useState([]);
    const [activeVDIPolicies, setActiveVDIPolicies]: any = useState([]);
    const [inActiveVDIPolicies, setInActiveVDIPolicies] = useState([]);
    const [isLocalProvisioning, setIsLocalProvisioning] = useState(false);
    const [isVdi, setIsVdi] = useState(false);
    const path = window.location.pathname.split('/').length;
    const { TabPane } = Tabs;
    const accountId = localStorage.getItem('accountId');

    const activateColumns = [
        {
            title: 'Sort',
            dataIndex: 'sort',
            width: '5%',
            className: 'drag-visible',
            render: (text: any, record: { default: any }) => (
                record.default === false ? <DragHandle /> : <></>
            )
        },
        {
            title: 'Order',
            dataIndex: 'order',
            width: '10%'
        },
        {
            title: 'Policy Name',
            dataIndex: 'policy_name',
            width: '15%'
        },
        {
            title: 'Policy Description',
            dataIndex: 'policy_description',
            width: '40%'
        },
        {
            title: 'Details',
            dataIndex: 'details',
            width: '10%',
            render: (text: any, record: { policy_id: any; }) => (
                <Tooltip title="View">
                    <Button icon={<BarsOutlined />} onClick={() => {
                        history.push(`/global-policies/` + window.location.pathname.split("/")[2] + "/" + record.policy_id);
                    }}>
                    </Button>
                </Tooltip>
            )
        },
        {
            title: 'Status',
            dataIndex: 'details',
            width: '30%',
            render: (text: any, record: { policy_id: any; default: any }) => (
                record.default === false ?
                    <Tooltip title="Deactivate">
                        <Button icon={<StopOutlined />} onClick={() => deActivateGlobalPolicy(record.policy_id)}>
                        </Button>
                    </Tooltip> : <></>
            )
        }
    ];

    const deActivateColumns = [
        {
            title: 'Policy Name',
            dataIndex: 'policy_name',
            width: '20%'
        },
        {
            title: 'Policy Description',
            dataIndex: 'policy_description',
            width: '50%'
        },
        {
            title: 'Details',
            dataIndex: 'details',
            width: '10%',
            render: (text: any, record: { policy_id: any; }) => (
                <Tooltip title="View">
                    <Button icon={<BarsOutlined />} onClick={() => {
                        history.push(`/global-policies/` + window.location.pathname.split("/")[2] + "/" + record.policy_id);
                    }}>
                    </Button>
                </Tooltip>
            )
        },
        {
            title: 'Status',
            dataIndex: 'details',
            width: '30%',
            render: (text: any, record: { policy_id: any; default: any }) => (
                record.default === false ?
                    <Tooltip title="Activate">
                        <Button icon={<PoweroffOutlined />} onClick={() => activateGlobalPolicy(record.policy_id)}>
                        </Button>
                    </Tooltip> : <></>
            )
        }
    ];

    const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
    const SortableItem = SortableElement(props => <tr {...props} />);
    const SortableBody = SortableContainer(props => <tbody {...props} />);

    const handleUserProvisioningSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex && newIndex !== activeUserProvisioningPolicies.length - 1) {
            const newData = arrayMoveImmutable([].concat(activeUserProvisioningPolicies), oldIndex, newIndex).filter(
                el => !!el,
            );
            console.log('Sorted items: ', newData);
            setActiveUserProvisioningPolicies(newData);
            //@ts-ignore
            console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
            //@ts-ignore
            reOrderGlobalPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, LOCAL_USER_PROVISIONING);
        }
    };

    const UserProvisioningDraggableContainer = (props) => (
        <SortableBody
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={handleUserProvisioningSortEnd}
            {...props}
        />
    );

    const UserProvisioningDraggableBodyRow = ({ className, style, ...restProps }) => {
        const index = activeUserProvisioningPolicies.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    }

    const handleVDISortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex && newIndex !== activeVDIPolicies.length - 1) {
            const newData = arrayMoveImmutable([].concat(activeVDIPolicies), oldIndex, newIndex).filter(
                el => !!el,
            );
            console.log('Sorted items: ', newData);
            setActiveVDIPolicies(newData);
            //@ts-ignore
            console.log(newData[newIndex].policy_id, newData.length - newIndex - 1);
            //@ts-ignore
            reOrderGlobalPolicies(newData[newIndex].policy_id, newData.length - newIndex - 1, VIRTUAL_DESKTOP_INTERFACE);
        }
    };

    const vdiDraggableBodyRow = ({ className, style, ...restProps }) => {
        const index = activeVDIPolicies.findIndex(x => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    }

    const vdiDraggableContainer = (props) => (
        <SortableBody
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={handleVDISortEnd}
            {...props}
        />
    );

    function handleGetPolicies() {
        getGlobalPolicies();
    }

    function getGlobalPolicies() {
        console.log(path);
        if (path === 3) {
            setLoadingDetails(true);
            ApiService.get(ApiUrls.globalPolicies(accountId))
                .then(data => {
                    if (!data.errorSummary) {
                        console.log(data);
                        var userProvisioningCounter = 0;
                        var vdiCounter = 0;
                        var userProvisioningActive: any = [];
                        var userProvisioningInActive: any = [];
                        var vdiActive: any = [];
                        var vdiInActive: any = [];
                        for (var i = 0; i < data.length; i++) {
                            var object;
                            if (data[i].policy_type === LOCAL_USER_PROVISIONING) {
                                if (data[i].active === true) {
                                    object = {
                                        key: userProvisioningCounter + 1,
                                        policy_name: data[i].name,
                                        policy_id: data[i].uid,
                                        policy_description: data[i].description,
                                        order: data[i].order,
                                        default: data[i].default,
                                        index: userProvisioningCounter + 1
                                    }
                                    userProvisioningCounter = userProvisioningCounter + 1;
                                    userProvisioningActive.push(object);
                                }
                                else {
                                    object = {
                                        key: userProvisioningCounter + 1,
                                        policy_name: data[i].name,
                                        policy_id: data[i].uid,
                                        policy_description: data[i].description,
                                        default: data[i].default,
                                        index: userProvisioningCounter + 1
                                    }
                                    userProvisioningCounter = userProvisioningCounter + 1;
                                    userProvisioningInActive.push(object);
                                }
                            }

                            if (data[i].policy_type === VIRTUAL_DESKTOP_INTERFACE) {
                                if (data[i].active === true) {
                                    object = {
                                        key: vdiCounter + 1,
                                        policy_name: data[i].name,
                                        policy_id: data[i].uid,
                                        policy_description: data[i].description,
                                        order: data[i].order,
                                        default: data[i].default,
                                        index: vdiCounter + 1
                                    }
                                    vdiCounter = vdiCounter + 1;
                                    vdiActive.push(object);
                                }
                                else {
                                    object = {
                                        key: vdiCounter + 1,
                                        policy_name: data[i].name,
                                        policy_id: data[i].uid,
                                        policy_description: data[i].description,
                                        default: data[i].default,
                                        index: vdiCounter + 1
                                    }
                                    vdiCounter = vdiCounter + 1;
                                    vdiInActive.push(object);
                                }
                            }
                        }
                        setActiveUserProvisioningPolicies(userProvisioningActive);
                        setInActiveUserProvisioningPolicies(userProvisioningInActive);
                        setActiveVDIPolicies(vdiActive);
                        setInActiveVDIPolicies(vdiInActive);
                        setLoadingDetails(false);
                    }
                    else {
                        openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                    }
                }, error => {
                    console.log(error)
                    openNotification('error', 'An Error has occured with getting Policies');
                })
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    useEffect(() => {
        ApiService.get(ApiUrls.info(accountId))
            .then(data => {
                setIsLocalProvisioning(data.enable_local_provisioning);
                setIsVdi(data.enable_vdi);

                if (window.location.pathname.split("/").length === 2) {
                    history.push(`global-policies/${data.enable_local_provisioning ? 'local-user-provisioning' : 'virtual-desktop-interface'}`);
                }
            })

        getGlobalPolicies();
    }, []);

    function activateGlobalPolicy(uid: string) {
        console.log(uid);
        ApiService.get(ApiUrls.activateGlobalPolicy(accountId, uid))
            .then(data => {
                if (!data.errorSummary) {
                    openNotification('success', 'Successfully activated Policy');
                    getGlobalPolicies();
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with activating Policy');
            })
    }

    function deActivateGlobalPolicy(uid: string) {
        console.log(uid);
        ApiService.get(ApiUrls.deActivateGlobalPolicy(accountId, uid))
            .then(data => {
                if (!data.errorSummary) {
                    openNotification('success', 'Successfully de-activated Policy');
                    getGlobalPolicies();
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with de-activating Policy');
            })
    }

    function reOrderGlobalPolicies(uid: string, order: number, policyType: string) {
        var data = {
            order: order,
            auth_policy_uid: uid,
            policy_type: policyType
        }
        ApiService.post(ApiUrls.reOrderGlobalPolicies(accountId), data)
            .then(data => {
                if (!data.errorSummary) {
                    console.log(data)
                    getGlobalPolicies();
                }
                else {
                    openNotification('error', data.errorCauses.length !== 0 ? data.errorCauses[0].errorSummary : data.errorSummary);
                }
            }, error => {
                console.error('Error: ', error);
                openNotification('error', 'An Error has occured with re-ordering Global Policies');
            })
    }

    return (
        <>
            <div className='content-header'>
                Global Policy
                {window.location.pathname.split('/').length === 4 ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
                    history.push(`/global-policies/` + window.location.pathname.split('/')[2]);
                }}>
                    Back
                </Button> : <></>}
            </div>

            <Tabs activeKey={window.location.pathname.split("/")[2]}
                type="card" size={"middle"} animated={false}
                tabBarStyle={{ marginBottom: '0px' }}
                onChange={(key) => {
                    history.push(`/global-policies/` + key);
                }}
            >
                {isLocalProvisioning ? <TabPane tab={policyDisplayNames[LOCAL_USER_PROVISIONING]} key="local-user-provisioning">
                    <Skeleton loading={loadingDetails}>
                        {window.location.pathname.split('/').length === 4 ?
                            <ProtectedRoute path={`/global-policies/local-user-provisioning/:id`} component={UserProvisioningPolicy} subRoute /> :
                            <TableList policy_type={LOCAL_USER_PROVISIONING} policy_description={LocalUserProvisioningPolicyDescription} activateColumns={activateColumns} deActivateColumns={deActivateColumns}
                                draggableBodyRow={UserProvisioningDraggableBodyRow} draggableContainer={UserProvisioningDraggableContainer}
                                inActivePolicies={inActiveUserProvisioningPolicies} activePolicies={activeUserProvisioningPolicies} handleGetPolicies={handleGetPolicies}
                            />
                        }
                    </Skeleton>
                </TabPane> : null
                }

                {isVdi ? <TabPane tab={policyDisplayNames[VIRTUAL_DESKTOP_INTERFACE]} key="virtual-desktop-interface">
                    <Skeleton loading={loadingDetails}>
                        {window.location.pathname.split('/').length === 4 ?
                            <ProtectedRoute path={`/global-policies/virtual-desktop-interface/:id`} component={VDIPolicy} subRoute /> :
                            <TableList policy_type={VIRTUAL_DESKTOP_INTERFACE} policy_description={VDI_Description} activateColumns={activateColumns} deActivateColumns={deActivateColumns}
                                draggableBodyRow={vdiDraggableBodyRow} draggableContainer={vdiDraggableContainer}
                                inActivePolicies={inActiveVDIPolicies} activePolicies={activeVDIPolicies} handleGetPolicies={handleGetPolicies}
                            />
                        }
                    </Skeleton>
                </TabPane> : null
                }
            </Tabs>
        </>
    )
}

export default GlobalPolicies;
