import Tooltip from "antd/lib/tooltip";
import { InfoCircleOutlined } from "@ant-design/icons";

function Hint({ text }) {
    return <Tooltip placement="right" title={text}>
        <InfoCircleOutlined style={{ padding: '0 10px 0 10px' }}/>
    </Tooltip>;
}

export default Hint;
