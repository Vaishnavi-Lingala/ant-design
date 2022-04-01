import { Button } from "antd";   
import { useHistory } from "react-router-dom";

const PageNotFound = () => {
    const history = useHistory();

    return (
        <div style={{textAlign: 'center', paddingTop: '100px'}}>
            <h3>
                404 page not found
            </h3>

            <p>
                We are sorry but the page you are looking for does not exist.
            </p>
            
            <Button type="primary" size="large" onClick={() => {history.push("/policies")}}>
                Go to Homepage
            </Button>
        </div>
    )
}

export default PageNotFound;
