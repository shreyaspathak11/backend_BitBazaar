const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const User = require('./models/user.model')
const Member = require('./models/newsletter.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const { OAuth2Client } = require('google-auth-library');
const Google = require('./models/google.model')

dotenv.config()
const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.post('/api/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10)
		await User.create({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: newPassword,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
})

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({
		email: req.body.email,
	})

	if (!user) {
		return { status: 'error', error: 'Invalid login' }
	}

	const isPasswordValid = await bcrypt.compare(
		req.body.password,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)

		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
})

app.post('/api/newsletter', async (req, res) => {
	console.log(req.body)
	try {
		const newMember = await Member.create({
			email: req.body.email,
		})
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate email' })
	}
}
)

app.post('/api/google-login', async (req, res) => {
	console.log(req.body)
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
	  idToken: token,
	  audience: process.env.CLIENT_ID,
	});
	const { name, email, picture } = ticket.getPayload();
	const user = await Google.findOne({
		email: email,
	})

	if (!user) {	
	await Google.create({ name, email, picture });
	res.status(201);
	res.json({ name, email, picture });
	} 
	else {
		res.json({ name, email, picture });
	}
});