var moment = require('moment');
var generateMessage = (from,text) =>{
    return{
        from,
        text,
        createdAt: moment().valueOf(new Date().getTime())
    };
};
var generateLocationMessage = (from,latitude,longitude)=>{
    return{
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf(new Date().getTime())
    };
};
module.exports = {generateMessage,generateLocationMessage};