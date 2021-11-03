const mysql = require('mysql')
const dbConnect = mysql.createConnection({
	host: 'dag-database-1.cgz433h6zhvi.us-west-2.rds.amazonaws.com',
	user: 'admin',
	password: 'dag!q2w#e4r',
	port: '3306',
	database: 'dag'
})

dbConnect.connect(error => {
	try {
		if (error) {
			console.log(`DB_ERROR_CODE : ${error.errno}\nDB_ERROR_MESSAGE : ${error.code}`)
			throw error
		}
		console.log('DB Connection Success')
	} catch(error) {
		console.log('DB Connection Error, Do Something(Logger...)')
	}
})

module.exports = dbConnect