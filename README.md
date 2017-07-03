# temp-mail [![Build Status](https://travis-ci.org/xomyaq/temp-mail.svg?branch=master)](https://travis-ci.org/xomyaq/temp-mail)

Simple node.js API wrapper for temp-mail.ru and small modification by me (LeetCodes) to work with temp-mail.org


## Install
```
npm install https://github.com/LeetCodes/temp-mail.git
```

## Usage
```
const TempMail = require('temp-mail')();
```

## Example of temp-mail.org usage
Temp-mail.org requires API username and password authentication, free credentials can be obtained by emailing them.
Each function returns a Promise
generateEmail, getInbox, deleteMail
Quick and dirty modification, more for personal use than anything..
Note: The temp-mail.org SSL certificate is currently expired so you need to disable certificate rejection, it defaults to HTTP
```
const TempMail = require('temp-mail')({
		domain: 'org',
		username: '11111111-2222-3333-4444-555555555555',
		password: '123456789',
		// Optional HTTPS when not required, defaults to false
		https: true
	});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

TempMail.generateEmail()
	.then(result => {
			console.log("Email generated:",result);
			TempMail.getInbox(result)
				.then(result => console.log(result))
		}
	).catch(function(e) {
		console.log(e);
	});
let email = TempMail.getInbox('33ef0r5@buy003.com');
email.then(function(result){
	console.log(result);
	}).catch(function(e) {
		console.log(e);
	});
```
## License

MIT
