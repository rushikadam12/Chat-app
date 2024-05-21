const ApiResponse = require("../utility/ApiResponse");


const userAuth = (req, res) => {
 return res.status(200).send(new ApiResponse(201,"user is authorized",{auth:true},true))   
}
module.exports=userAuth