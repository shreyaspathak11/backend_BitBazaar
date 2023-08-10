const mongoose = require('mongoose')

const Google = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true},
		picture: { type: String, required: true },
	},
	{ collection: 'google-data' }
)

const model = mongoose.model('GoogleData', Google)

module.exports = model