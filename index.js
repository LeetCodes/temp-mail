const	crypto = require('crypto'),
		https = require('https'),
		http = require('http')
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Description
 * @method TempMail
 * @param {} config
 * @return ObjectExpression
 */
function TempMail(conf={domain: 'ru', https: false}) {
	const API_URL = () => ( conf.domain === 'org' ? 'api2.temp-mail.org' : 'api.temp-mail.ru' );
	const API_USERNAME = conf.username;

	/**
	 * Description
	 * @method get
	 * @param {} url
	 * @return NewExpression
	 */
	function get(url) {
		var h = () => ( ( typeof conf.username !== typeof undefined && typeof conf.password !== typeof undefined && conf.domain !== 'ru' ) ? { 'Authorization': 'Basic ' + new Buffer(conf.username + ':' + conf.password).toString('base64') } : { } ),
			options = {
				host: API_URL(),
				port: ( (conf.domain === 'ru') ? 443 : (conf.https) ? 443 : 80 ),
				path: url,
				headers: h()
			};
		return new Promise((resolve, reject) => {
			((( conf.domain === 'org' ) ? (( typeof conf.username !== typeof undefined && typeof conf.password !== typeof undefined ) ? true : (() => { reject(new Error('API Authentication required for temp-mail.org')); })()) : false ));
			( (conf.domain === 'ru') ? https : (conf.https) ? https : http )
				.get(options, (res) => {
					if (res.statusCode !== 404 && (res.statusCode < 200 || res.statusCode > 299)) {
						reject(new Error(`Request failed: ${res.statusCode}`));
					}

					let data = '';

					res
						.on('data', (chunk) => { data += chunk; })
						.on('end', () => resolve(data));
				})
				.on('error', reject);
		});
	}
	/**
	 * Description
	 * @method getEmailHash
	 * @param {} email
	 * @return CallExpression
	 */
	function getEmailHash(email) {
		return crypto.createHash('md5').update(email).digest('hex');
	}
	/**
	 * Description
	 * @method getRandomEmail
	 * @param {} domains
	 * @param {} length
	 * @param {} prefix
	 * @return BinaryExpression
	 */
	function getRandomEmail(domains, len = 7, prefix = '') {
		const alfabet = '1234567890abcdefghijklmnopqrstuvwxyz';

		let name = !prefix ? '' : `${prefix}-`;

		for (let i = 0; i < len; i++) {
			const randomChar = Math.round(Math.random() * (alfabet.length - 1));
			name += alfabet.charAt(randomChar);
		}

		const domain = domains[Math.floor(Math.random() * domains.length)];

		return name + domain;
	}
	/**
	 * Description
	 * @method getAvailableDomains
	 * @return CallExpression
	 */
	function getAvailableDomains() {
		return get(`/request/domains/format/json/`).then(JSON.parse);
	}

    return {
        generateEmail: (len, prefix) => {
			return getAvailableDomains()
				.then(availableDomains => getRandomEmail(availableDomains, len, prefix));
		},
		getInbox: (email) => {
			return new Promise((resolve, reject) => {
				if (!email) {
					return reject('Please specify email');
				}
				resolve(get(`/request/mail/id/${getEmailHash(email)}/format/json/`).then(JSON.parse));
			});
		},
		deleteMail: (mailId) => {
			return new Promise((resolve, reject) => {
				if (!mailId) {
					return reject('Please specify mail identifier');
				}
				resolve(get(`/request/delete/id/${mailId}/format/json/`).then(JSON.parse));
			});
		}
    };
}

module.exports = TempMail;
