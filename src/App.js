import { Box, Text, Input, Label, Button } from 'theme-ui'
const App = () => {

	const join = (e) => {
		e.preventDefault()
		const email = e.target.elements.email.value
		const password = e.target.elements.password.value
	}

	const login = (e) => {
		e.preventDefault()
		const email = e.target.elements.email.value
		const password = e.target.elements.password.value
	}

	const oerder = (e) => {
		e.preventDefault()
		const token = e.target.elements.token
		const instrumentId = e.target.elements.instrument_id
		const size = e.target.elements.size
		const price = e.target.elements.price
		const type1 = e.target.elements.type1
		const type2 = e.target.elements.type2
	}

	const search = (e) => {
		e.preventDefault()
		const token = e.target.elements.token
		const baseTime = e.target.elements.base_time
	}
	
	return (
		<Box sx={{'.title' : { mt : 3}}}>
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
				<Box as="form" onSubmit={(e) => e.preventDefault()}>
  				<Label htmlFor="email">email</Label>
  				<Input name="email" id="email"/>
  				<Label htmlFor="password">Password</Label>
  				<Input type="password" name="password" id="password"/>
					<Button sx={{color:'black', cursor: 'pointer'}}>로그인</Button>
				</Box>
			</Box>
			<Box>
				<Text as="h3" className="title">주문</Text>
				<Box as="form" onSubmit={(e) => e.preventDefault()}>
  				<Label htmlFor="token">token</Label>
  				<Input name="token" id="token"/>
  				<Label htmlFor="instrument_id">instrument_id</Label>
  				<Input type="instrument_id" name="instrument_id" id="instrument_id"/>
					<Label htmlFor="size">size</Label>
  				<Input type="size" name="size" id="size"/>
					<Label htmlFor="price">price</Label>
  				<Input type="price" name="price" id="price"/>
					<Label htmlFor="type1">type1</Label>
  				<Input type="type1" name="type1" id="type1"/>
					<Label htmlFor="type2">type2  </Label>
  				<Input type="type2" name="type2" id="type2"/>
					<Button sx={{color:'black', cursor: 'pointer'}}>주문</Button>
				</Box>
			</Box>
			<Box>
				<Text as="h3" className="title">조회</Text>
				<Box as="form" onSubmit={(e) => e.preventDefault()}>
  				<Label htmlFor="token">token</Label>
  				<Input name="token" id="token"/>
  				<Label htmlFor="base_time">base_time </Label>
  				<Input type="base_time" name="base_time" id="base_time"/>
					<Button sx={{color:'black', cursor: 'pointer'}}>조회</Button>
				</Box>
			</Box>
		</Box>
	)
}

export default App
