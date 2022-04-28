import { Button, Skeleton, Table } from 'antd';
import { useEffect, useState } from 'react';

import './Mechanism.css';

import Mechanism from './mechanism';
import Apis from '../../Api.service';
import { useHistory } from 'react-router-dom';

export default function Mechanisms() {

	const columns = [
		{
			title: 'Mechanism Name',
			dataIndex: 'mechanism_name',
			width: '30%'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			width: '40%',
			render: (text: any, record: { mechanism_id: any; }) => (
				<Button onClick={() => getMechanismDetails(record.mechanism_id)}>
					View
				</Button>
			)
		}
	];

	//@ts-ignore
	const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
	const [mechanismDetails, setMechanismDetails] = useState(undefined);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [arr, setArr]: any = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const history = useHistory();
	const mechanism = {
		order: 0,
		challenge_factors: [
			{
				order: 0,
				factor: "",
				name: "Challenge_Test_1",
				password_grace_period: "TWO_HOURS"
			},
			{
				order: 1,
				factor: "",
				name: "Challenge_Test_2",
				password_grace_period: null
			}
		],
		reader_type: "",
		product_id: "oprc735871d0",
		name: "",
		on_tap_out: ""
	}

	useEffect(() => {
		if (window.location.pathname.split("/").length === 3) {
			getMechanismDetails(window.location.pathname.split('/')[2]);
		}
		setLoadingDetails(true);
		Apis.getAllMechanisms(accessToken)
			.then(data => {
				for (var i = 0; i < data.length; i++) {
					var obj = {
						key: i + 1,
						mechanism_name: data[i].name,
						mechanism_id: data[i].uid
					}
					arr.push(obj);
				}
				setLoadingDetails(false);
			})
	}, [])

	function getMechanismDetails(uid: string) {
		localStorage.setItem("mechanismUid", uid);
		setLoadingDetails(true);
		Apis.getMechanismDetails(uid, accessToken)
			.then(data => {
				history.push('/mechanism/' + uid);
				console.log(data);
				console.log(mechanism);
				setMechanismDetails(data);
				setLoadingDetails(false);
			})
			.catch(error => console.log(error))
	}

	return (
		<>
			<div className='content-header'>
				Mechanism
				{mechanismDetails ? <Button style={{ marginLeft: 'auto', alignSelf: 'end' }} onClick={() => {
					setMechanismDetails(undefined)
					history.push('/mechanism')
				}}>Back</Button> : <></>}
			</div>

			<Skeleton loading={loadingDetails}>
				{mechanismDetails ? <Mechanism mechanismDetails={mechanismDetails} /> :
					isModalVisible ? <Mechanism mechanismDetails={mechanism} /> : <>
						<div style={{
							width: '100%', border: '1px solid #D7D7DC',
							borderBottom: 'none', padding: '10px 10px 10px 25px', backgroundColor: '#f5f5f6'
						}}
						>
							<Button type='primary' size='large' onClick={() => setIsModalVisible(true)}>
								Add New Mechanism
							</Button>
						</div>

						<Table
							style={{ border: '1px solid #D7D7DC' }}
							showHeader={true}
							columns={columns}
							dataSource={arr}
							pagination={{ position: [] }}
						/>
					</>
				}
			</Skeleton>
		</>
	);
}
