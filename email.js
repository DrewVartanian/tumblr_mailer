var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: '7oSBUNm9K1MBwzRSEQhk0OZT4m4fIJSfijo53y3utD7Iw1xN8j',
  consumer_secret: '3TLE2zTveSlKeLPsoHYuZYplpMQIZWb0fhS8NJcxuxkF69XEfq',
  token: 'x8yJNhoPXf5yoy6VDMuJ9SoXysogO0PcFuIeV6xxZICXFjZFFk',
  token_secret: 'a0BiVkXTY1Qm5bjWr7a7V3V0fwo51IRfeJqizO6MKXHAecUaQo'
});
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('4eVtgwhmBPEqg2WIncq72A');



function customize(csvData,emailTemplate){
	client.posts('drewvartanian', function(err, blog){
	  //Read csv file to string
	  var emailStr = fs.readFileSync(emailTemplate,"utf8");
	  var timestamp = Date.now()/1000;
	  var latestPosts = [];
	  var customizedTemplate;

	  blog.posts.forEach(function(entry){
	  	if((timestamp-entry.timestamp)<(30*24*60*60)){
	  		latestPosts.push(entry);
	  	}
	  });
	  csvData.forEach(function(contact){
		customizedTemplate=ejs.render(emailStr,{ firstName: contact.firstName,  
		              numMonthsSinceContact: contact.numMonthsSinceContact,
		              latestPosts: latestPosts
		});
	  	 sendEmail(contact.firstName+' '+contact.lastName,
	  	 		contact.emailAddress, 'Drew Vartanian',
	  	 		'Drew.Vartanian@gmail.com','Tumblr Update',
	  	 		customizedTemplate);
	  });
	});
	//return emailStr;
}

function sendEmail(to_name, to_email, from_name, from_email, subject, message_html){
    var message = {
        "html": message_html,
        "subject": subject,
        "from_email": from_email,
        "from_name": from_name,
        "to": [{
                "email": to_email,
                "name": to_name
            }],
        "important": false,
        "track_opens": true,    
        "auto_html": false,
        "preserve_recipients": true,
        "merge": false,
        "tags": [
            "Fullstack_Tumblrmailer_Workshop"
        ]    
    };
    var async = false;
    var ip_pool = "Main Pool";
    mandrill_client.messages.send({"message": message, "async": async, "ip_pool": ip_pool}, function(result) {
        // console.log(message);
        // console.log(result);   
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        // A mandrill error occurred: Unknown_Subaccount - No subaccount exists with the id 'customer-123'
    });
 }

module.exports.customize = customize;