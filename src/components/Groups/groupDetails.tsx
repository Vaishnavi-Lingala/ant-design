import { useState } from "react";

export default function GroupDetails(props: any) {
    const [groupDetails, setGroupDetails] = useState(props.groupDetails);
    console.log('Group details: ', groupDetails)

    return(
        <>
            <div className='content-header'>
				{groupDetails.name}
			</div>
        </>
    )
}