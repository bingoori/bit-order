import { Box, Text, Input, Label, Button, Textarea, Select } from 'theme-ui'
import { useEffect, useState } from 'react'

const App = () => {
	const [ instrumentIdList, setInstrumentIdList] = useState()
	useEffect(() => {
		fetch('http://localhost:3001/instrument_id_list')
			.then(res => res.json())
			.then(list => setInstrumentIdList(list.instrument_id_list))
	}, [])
	
	const join = (e) => {
		e.preventDefault()
		const email = e.target.elements.email.value
		const password = e.target.elements.password.value
		fetch('http://localhost:3001/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ email, password }),
		})
			.then(res => res.json())
			.then(data => { 
				if (data.code === '0000') {
					alert('가입완료')
				} else {
					alert(data.code)
				}
			})
	}

	const login = (e) => {
		e.preventDefault()
		const email = e.target.elements.email.value
		const password = e.target.elements.password.value
		fetch('http://localhost:3001/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ email, password }),
		})
			.then(res => res.json())
			.then(data => { 
				if (data.code === '0000') {
					alert('로그인 완료')
					document.querySelectorAll('.token').forEach(current => {
						current.value = data.token
					})
				} else {
					alert(data.code)
				}
			})
	}

	const order = (e) => {
		e.preventDefault()
		const token = e.target.elements.token.value
		const instrument_id = e.target.elements.instrument_id.value
		const price = e.target.elements.price.value
		const size = e.target.elements.size.value
		const type1 = e.target.elements.type1.value
		const type2 = e.target.elements.type2.value
		fetch('http://localhost:3001/order', {
			method: 'POST', 
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ token, instrument_id, price, size, type1, type2 }),
		})
			.then(res => res.json())
			.then(data => { 
				if (data.code === '0000') {
					alert('주문 완료')
					createOrderText(data)
				} else {
					alert(data.code)
				}
			})
	}

	const createOrderText = (data) => {
		let text = ''
		if (data.orderData.length > 0) {
			data.orderData.map(current => {
				text += `${current.instrumentId}, ${current.contractPrice} , ${current.contractCount}, ${current.type === '1' ? 'long' : 'short'}, ${current.type === '0' ? 'limit order' : 'market'} \n`
			})
		}
		text += `미체결수: ${data.remainCount} \n총체결수: ${data.totalContractCount}`
		document.getElementById('orderResult').value = text
	}

	const search = (e) => {
		e.preventDefault()
		const token = e.target.elements.token.value
		const baseTime = e.target.elements.baseTime.value
		fetch(`http://localhost:3001/fetch?token=${token}&base_time=${baseTime}`)
			.then(res => res.json())
			.then(data => { 
				if (data.code === '0000') {
					createSearchText(data)
				} else {
					alert(data.code)
				}
			})

	}

	const createSearchText = (data) => {
		let text = ''
		if (data.long.length > 0) {
			text += '[매수내역] \n'
			data.long.map(current => {
				text += `${current.instrument_id}, ${current.contract_price} , ${current.contract_count}, ${current.type === '0' ? 'limit order' : 'market'} \n`
			})
		} 
		if (data.short.length > 0) {
			text += '[매도내역] \n'
			data.short.map(current => {
				text += `${current.instrument_id}, ${current.contract_price} , ${current.contract_count}, ${current.type === '0' ? 'limit order' : 'market'} \n`
			})
		}
		if (text.length === 0) text += '조회결과없음'
		document.getElementById('searchResult').value = text
	}
	
	return (
		<Box sx={{textAlign: '-webkit-center'}}>
			<Box sx={{width : '50%', minWidth: '300px', '.title' : { mt : 3}}}>
				<Text as='h1'>DAG-OKex API with Firebase</Text>
				<Box>
					<Text as="h3" className="title">회원가입</Text>
					<Box as="form" onSubmit={(e) => join(e)}>
						<Label htmlFor="email">email</Label>
						<Input name="email" id="email"/>
						<Label htmlFor="password">Password</Label>
						<Input type="password" name="password" id="password"/>
						<Button sx={{color:'black', cursor: 'pointer'}}>가입</Button>
					</Box>
				</Box>
				<Box>
					<Text as="h3" className="title">로그인</Text>
					<Box as="form" onSubmit={(e) => login(e)}>
						<Label htmlFor="email">email</Label>
						<Input name="email" id="email"/>
						<Label htmlFor="password">Password</Label>
						<Input type="password" name="password" id="password"/>
						<Button sx={{color:'black', cursor: 'pointer'}}>로그인</Button>
					</Box>
				</Box>
				<Box>
					<Text as="h3" className="title">주문</Text>
					<Box as="form" onSubmit={(e) => order(e)}>
						<Label htmlFor="token">token(입력X)</Label>
						<Input className="token" name="token"/>
						<Label htmlFor="instrument_id">instrument_id</Label>
						<Select name="instrument_id" id="instrument_id">
							{ 
								instrumentIdList && instrumentIdList.map((current => <option key={`${current.instrument_id}`}>{current.instrument_id}</option>))
							}
						</Select>
						<Label htmlFor="size">size(요청개수)</Label>
						<Input type="size" name="size" id="size"/>
						<Label htmlFor="price">price</Label>
						<Input type="price" name="price" id="price"/>
						<Label htmlFor="type1">type1(매수, 매도)</Label>
						<Select name="type1" id="type1">
							<option value="1">매수</option>
							<option value="2">매도</option>
						</Select>
						<Label htmlFor="type2">type2(지정가 , 시장가 )</Label>
						<Select name="type2" id="type2">
							<option value="0">지정가</option>
							<option value="4">시장가</option>
						</Select>
						<Label htmlFor="orderResult">주문체결결과(입력X)</Label>
						<Textarea type="orderResult" name="orderResult" id="orderResult" rows="5" sx={{resize: 'none'}}/>
						<Button sx={{color:'black', cursor: 'pointer'}}>주문</Button>
					</Box>
				</Box>
				<Box>
					<Text as="h3" className="title">조회</Text>
					<Box as="form" onSubmit={(e) => search(e)}>
						<Label htmlFor="token">token(입력X)</Label>
						<Input className="token" name="token"/>
						<Label htmlFor="baseTime">base_time(2021-11-03 20:00:00)</Label>
						<Input type="baseTime" name="baseTime" id="baseTime" placeholder="2021-11-03 20:00:00"/>
						<Label htmlFor="searchResult">조회결과(입력X)</Label>
						<Textarea type="searchResult" name="searchResult" id="searchResult" rows="5" sx={{resize: 'none'}}/>
						<Button sx={{color:'black', cursor: 'pointer'}}>조회</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default App
