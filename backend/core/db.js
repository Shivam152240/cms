const mongoose = require('mongoose');

module.exports = async function connectDB() {
	const uri = process.env.MONGO_URI;

	// Basic validation to provide a clearer error than the Mongo driver
	if (!uri || typeof uri !== 'string' || uri.trim() === '') {
		console.error('\nMissing or empty MONGO_URI environment variable.\n' +
			'Please set MONGO_URI in backend/.env. Examples:\n' +
			"  - Local (no auth): MONGO_URI=mongodb://localhost:27017/mydbname\n" +
			"  - With auth:      MONGO_URI=mongodb://user:pass@localhost:27017/mydbname?authSource=admin\n" +
			"  - Atlas (SRV):    MONGO_URI=mongodb+srv://user:pass@cluster0.abcd.mongodb.net/mydbname?retryWrites=true&w=majority\n\n" +
			'If your password contains special characters, URL-encode them (or wrap the URI appropriately).\n');
		process.exit(1);
	}

	// Detect obvious placeholder values to help the developer fix mistakes
	if (uri.includes('<host>') || uri.includes('<port>') || uri.includes('iLoveJS://')) {
		console.error('\nMONGO_URI appears to contain placeholder values.\n' +
			'Please replace placeholders with real values. Example: "mongodb://localhost:27017/mydb"\n');
		process.exit(1);
	}

	try {
		await mongoose.connect(uri);
		console.log('MongoDB connected');
	} catch (err) {
		console.error('\nFailed to connect to MongoDB. Error:\n', err.message || err);
		console.error('Please verify MONGO_URI and that the database is reachable from this machine.');
		process.exit(1);
	}
};