const moment = require('moment')

module.exports = {
    select: (selected, option) => {
        return option.fn(this).replace(new RegExp('value=\"'+ selected +'\"'), '$&selected="selected"')
    },
    formatDate: (date, format) => {
        return moment(date).format(format)
    },
    empty: (jsObj) => {
        if (Object.keys(jsObj).length) {
            return true
        } else {
            return false
        }
    },
}