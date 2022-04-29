import { useEffect, useState } from "react";
import ApiService from "../../Api.service";

export default function GroupDetails(props: any) {

    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [users, setUsers] = useState([]);
    console.log('Group details: ', groupDetails)
    console.log('Is default: ', groupDetails.is_default);

    useEffect(() => {
		// setLoadingDetails(true);
        ApiService.getUsersInGroup(groupDetails.uid, accessToken)
		.then(data => {
			console.log('Users: ', data);
            // data.forEach(group => {
            //     group.key = group.uid;
            // })
            // setGroups(data);
			// setLoadingDetails(false);
		})
	}, [])

    return(
        <>
            <div className="content-container rounded-grey-border">
                <div className="row-container">
                    <div style={{ paddingTop: '20px' }}>
                        <h6>Group name</h6>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                            {groupDetails.name}
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        <h6>Status</h6>
                    </div>
                    <div style={{ paddingTop: '20px' }}>
                        {groupDetails.status}
                    </div>
                </div>
            </div>
        </>
    )
}