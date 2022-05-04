const moment = require("moment");
const colors = require('colors');

module.exports = {
    log(type, message, color) {
        console.log(moment(Date.now()).format("DD. MM. YYYY HH:mm:ss").grey + " [" + type.toUpperCase().bold[color] + "] " + message);
    }
}