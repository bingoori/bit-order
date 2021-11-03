const express = require('express')
const bcrypt = require('bcrypt')
const dbConnection = require('../database/mysql')
const axios = require('axios')
const { auth, admin } = require('../firebase/firebase')
const { manufactureOrderData, manufactureTickerData } = require('../common/functions.js')

const app = express()
const bodyParser = require('body-parser')
const port = process.env.port || 3001
const cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

//회원가입
app.post('/register', (request, response) => {
	const email = request.body.email
	const password = request.body.password
	auth.createUserWithEmailAndPassword(auth.getAuth(), email, password).then((result) => {
		bcrypt.hash(password, 10, (err, bcryptPassword) => {
			const rowQuery = `INSERT INTO member(email, password, uid) VALUES ('${result.user.email}', '${bcryptPassword}', '${result.user.uid}');`
			dbConnection.query(rowQuery, (error) => {
				if (error) {
					auth.deleteUser(auth.getAuth().currentUser) //firebase 가입된 유저 삭제
				}
				response.json({code : '0000', errno: undefined}) // mysql error enum 처리해야함
			})
		})
	}).catch(error => {
		response.json({ code: error.code }) // firebase error enum 처리해야함
	})
})

//로그인
app.post('/login', (request, response) => {
	const email = request.body.email
	const password = request.body.password
	auth.signInWithEmailAndPassword(auth.getAuth(), email, password)
		.then((userCredential) => {
			const token = userCredential.user.accessToken
			const loginQuery = `SELECT id, password FROM member WHERE email = '${userCredential.user.email}' AND uid = '${userCredential.user.uid}';`
			dbConnection.query(loginQuery, (error, rows) => {
				if (error) {
					// mysql error enum 처리 해야함
					response.send({ code: error.code, errno: error.errno })
					// firebase 로그인된 유저 로그아웃
					auth.getAuth().signOut()
					// 데이터가 없거나 비밀번호가 틀린 경우
				} else if (!(rows.length > 0 && bcrypt.compareSync(password, rows[0].password))) {
					//코드 정의 하는게 좋을 듯
					response.send({ code: '0000', errno: '9999', message: 'email or password do not match' })
					//firebase 로그인된 유저 로그아웃
					auth.getAuth().signOut()
				} else {
					const insertQuery = `UPDATE member SET token = '${token}' WHERE id=${rows[0].id};`
					dbConnection.query(insertQuery, error => {
						if (error) {
							// mysql error enum 처리 해야함
							response.send({ code: error.code, errno: error.errno })
						}
						response.json({ code: '0000', errno: undefined, token: token})
					})
				}
			})
		}).catch(error => {
			response.json({ code: error.code })
		})
})

//주문
app.post('/order', (request, response) => {
	const token = request.body.token
	const instrumentId = request.body.instrument_id
	const orderPrice = request.body.price
	const orderCount = request.body.size
	const type = request.body.type1
	const orderType = request.body.type2
	admin.auth().verifyIdToken(token).then((decodedToken) => {
		const uid = decodedToken.uid
		axios.get(`https://www.okex.com/api/futures/v3/instruments/${instrumentId}/book?size=200`).then(instrumentBook => {
			const asks = instrumentBook.data.asks
			const bids = instrumentBook.data.bids
			const orderData = manufactureOrderData({
				asks,
				bids,
				type,
				orderPrice,
				orderCount,
				orderType,
				uid,
				instrumentId
			})
			const orderArr = orderData.orderArr
			const remainCount = orderData.remainCount

			if (orderArr.length > 0) { 
				const orderQuery = 'INSERT INTO order_info( uid, instrument_id, order_price, order_count, contract_price, contract_count, contract_time, type, order_type ) VALUES ?'
				dbConnection.query(orderQuery, [orderArr.map(current => [current.uid, current.instrumentId, current.orderPrice, current.orderCount, current.contractPrice, current.contractCount, current.contractTime, current.type, current.orderType])], (error, rows) => {
					if (error) {
						response.send({ code: error.code, errno: error.errno })
					}
				})
			}
			response.json({
				code: '0000',
				orderData: orderArr,
				remainCount: remainCount,
				totalContractCount: orderCount - remainCount
			})
		}).catch(error => {
			if (error.response) {
				response.json({ code: error.response.status })
			} else if (error.request) {
				response.json({ code: error.request.res.statusCode})
			} else {
				response.json({ code: error.message})
			}
		})
	}).catch(error => {
		// firebase error enum 처리
		response.json({ code: error.code })
	})
})

//조회
app.get('/fetch', (request, response) => {
	const token = request.query.token
	const baseTime = new Date(request.query.base_time)
	admin.auth().verifyIdToken(token).then((decodedToken) => {
		const uid = decodedToken.uid
		axios.get('https://www.okex.com/api/futures/v3/instruments/ticker').then(instrumentTicker => {
			const selectQuery = 'SELECT instrument_id, order_price, order_count, contract_price, contract_count, contract_time, type, order_type FROM order_info WHERE uid=? AND contract_time >= DATE_FORMAT(?,\'%Y-%m-%d %H:%i:%s\')'
			dbConnection.query(selectQuery,[uid, baseTime], (error, rows) => {
				if (error) {
					response.send({ code: error.code, errno: error.errno })
				}
				const orderHistory = manufactureTickerData({ ticker: instrumentTicker.data, rows: rows })
				response.json({
					code: '0000',
					long: orderHistory.longArr,
					short: orderHistory.shortArr
				})
			})
		}).catch(error => {
			if (error.response) {
				response.json({ code: error.response.status })
			} else if (error.request) {
				response.json({ code: error.request.res.statusCode})
			} else {
				response.json({ code: error.message})
			}
		})
	}).catch(error => {
		response.json({ code: error.code })
	})
})

app.get('/instrument_id_list', async(request, response) => {
	const list = await axios.get('https://www.okex.com/api/futures/v3/instruments')
	response.json({ code: '0000', instrument_id_list: list.data})
})

app.listen(port)