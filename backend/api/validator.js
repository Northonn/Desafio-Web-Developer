var moment = require('moment'); // require

module.exports = app => {
    function existsOrError(value, msg) {
        if(!value) throw msg
        if(Array.isArray(value) && value.length === 0) throw msg
        if(typeof value === 'string' && !value.trim()) throw msg
    }
    
    function notExistsOrError(value, msg) {
        try {
            existsOrError(value,msg)
        } catch(msg){
            return msg
        }
        throw msg
    }    

    function dateError(dateStart,dateEnd, msg) {

        if( moment(dateEnd) < moment(dateStart)) throw msg
    }

    return { existsOrError, notExistsOrError, dateError }
}