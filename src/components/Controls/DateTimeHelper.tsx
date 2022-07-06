import moment from "moment"
import { date_display_format, time_format } from "../../constants"

function DisplayDateTimeFormat(utcTime) {
    return moment.utc((utcTime)).local().format(`${date_display_format} ${time_format}`);
}

export default DisplayDateTimeFormat