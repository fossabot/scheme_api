const mongoose = require("mongoose");

let notificationObj = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    date_created:{
        type:Date,
        default:Date.now
    },
    isRead:{
        type:Boolean,
        default:false
    },
    
});


export default = mongoose.model("Notification",notificationObj);