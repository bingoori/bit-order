const dayjs = require('dayjs')

const manufactureOrderData = (data) => {
	const type = data.type
	const orderType = data.orderType
	if ( type === '1') { //매수
		if ( orderType === '0') { // 지정가 주문
			return manufatureData(data)
		} else if (orderType === '4') { // 시장가 주문
			return manufatureData(data)
		}
	}
	if (type === '2') { //매도
		if ( orderType === '0') { // 지정가 주문
			return manufatureData(data)
		} else if (orderType === '4') { // 시장가 주문
			return manufatureData(data)
		}
	}
}

const manufatureData = (data)  => {
	const uid = data.uid
	const instrumentId = data.instrumentId
	const orderCount = data.orderCount
	const type = data.type
	const list = type === '1' ? data.asks : data.bids
	const orderType = data.orderType
	const orderPrice = orderType === '0' ? data.orderPrice : 0

	const contractTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
	let tempSize = orderCount
	let remainSize = orderCount //남은 요청 수량
	let orderArr = []
	let remainCount = orderCount // 남은 수량
	let contractCount = 0 
	for (let i = 0; i < list.length; i++) {
		const contractPrice = list[i][0] //계약가능금액
		const numberContractsAvailable = list[i][1] //계약가능갯수
		contractCount = (tempSize - numberContractsAvailable) < 0 ? tempSize : numberContractsAvailable
		tempSize -= numberContractsAvailable
		
		if (type === '1' && orderType === '0') { // 매수 지정가
			if (contractPrice >= orderPrice || contractCount < 0) break
		}
		if (type === '1' && orderType === '4') { // 매수 시장가
			if (contractCount < 0) break
		}

		if (type === '2' && orderType === '0') { // 매도 지정가
			if (contractPrice <= orderPrice || contractCount < 0) break
		}

		if (type === '2' && orderType === '4') { // 매도 시장가
			if (contractCount < 0) break
		}

		orderArr.push({
			uid,
			instrumentId,
			orderPrice,
			orderCount: remainSize,
			contractPrice,
			contractCount,
			contractTime,
			type,
			orderType
		})
		remainSize = remainSize - contractCount
		remainCount = tempSize < 0 ? 0 : tempSize
	}
	return { orderArr, remainCount}
}

const manufactureTickerData = (data) => {
	const tickerArray = {}
	const longArr = []
	const shortArr = []
	data.ticker.map(current => {
		tickerArray[current.instrument_id] = current.last
	})
	data.rows && data.rows.map(current => {
		const lastPrice = tickerArray[current.instrument_id]
		if (current.type === 1) { //long
			current.last_price = lastPrice
			current.loss = (lastPrice * current.contract_count) - (current.contract_price * current.contract_count)
			longArr.push(current)
		} else { //short
			current.last_price = lastPrice
			current.loss = (current.contract_price * current.contract_count) - (lastPrice * current.contract_count)
			shortArr.push(current)
		}
	})
	return { longArr, shortArr}
}

module.exports = { manufactureOrderData, manufactureTickerData }