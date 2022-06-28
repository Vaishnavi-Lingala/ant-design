import { useHistory } from "react-router-dom";
import { Button } from "antd";   

const PageNotFound = () => {
    const history = useHistory();

    return (
        <div style={{textAlign: 'center', paddingTop: '100px'}}>
            <div style={{textAlign: 'center', fontSize: 'xx-large', fontWeight: '600'}}>
                404 page not found
            </div>

            <p>
                We are sorry but the page you are looking for does not exist.
            </p>
            
            <Button type="primary" size="large" onClick={() => {history.push("/dashboard")}}>
                Go to Homepage
            </Button>
        </div>
    )
}

export default PageNotFound;
