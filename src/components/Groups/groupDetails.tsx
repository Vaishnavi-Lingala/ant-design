import { useEffect, useState } from "react";
import ApiService from "../../Api.service";

export default function GroupDetails(props: any) {

    //@ts-ignore
    const accessToken = JSON.parse(localStorage.getItem("okta-token-storage")).accessToken.accessToken
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    const [users, setUsers] = useState([]);
    console.log('Group details: ', groupDetails)

    // useEffect(() => {
	// 	// setLoadingDetails(true);
    //     ApiService.getUsersInGroup(groupDetails.uid, accessToken)
	// 	.then(data => {
	// 		console.log('Users: ', data);
    //         // data.forEach(group => {
    //         //     group.key = group.uid;
    //         // })
    //         // setGroups(data);
	// 		// setLoadingDetails(false);
	// 	})
	// }, [])

    return(
        <>
            <div className='content-header'>
				{groupDetails.name}
			</div>
        </>
    )
}