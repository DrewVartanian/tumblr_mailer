
var csv = require("./csv_handler.js");
var email = require("./email.js");

var csv_data = csv.parse("friend_list.csv")

//console.log(csv_data);

email.customize(csv_data,"./email_template.html");