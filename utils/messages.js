import moment from "moment";

export const formatMessage = (username, text)=>{
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}