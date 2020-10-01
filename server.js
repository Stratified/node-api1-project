const express = require('express');
const db = require('./database');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
	const users = db.getUsers();
	if (users) {
		res.json(users);
	} else {
		res
			.status(500)
			.json({ errorMessage: "The user's information could not be retrieved." });
	}
});

server.get('/api/users/:id', (req, res) => {
	const id = req.params.id;
	const user = db.getUserById(id);
	if (user) {
		res.json(user);
	} else {
		res
			.status(404)
			.json({ message: 'The user with the specified ID does not exist.' });
	}
});

server.post('/api/users', (req, res) => {
	const newUser = db.createUser({ name: req.body.name, bio: req.body.bio });

	if (!newUser.bio || !newUser.name) {
		res
			.status(400)
			.json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		if (newUser) {
			res.status(201).json(newUser);
		} else {
			res.status(500).json({
				errorMessage:
					'There was an error while saving the user to the database.',
			});
		}
	}
});

server.put('/api/users/:id', (req, res) => {
	const id = req.params.id;
	const user = db.getUserById(id);

	if (!user.bio || !user.name) {
		res
			.status(404)
			.json({ errorMessage: 'Please provide name and bio for the user.' });
	} else {
		if (user) {
			const updatedUser = db.updateUser(id, {
				name: req.body.name,
				bio: req.body.bio,
			});
			res.status(200).json(updatedUser);
		} else {
			res
				.status(404)
				.json({ message: 'The user with the specified ID does not exist.' });
		}
	}
});

server.delete('/api/users/:id', (req, res) => {
	const id = req.params.id;
	const user = db.getUserById(id);
	if (user) {
		db.deleteUser(id);
		res.status(204).end();
	} else {
		res
			.status(404)
			.json({ message: 'The user with the specified ID does not exist.' });
	}
});

server.listen(8080, () => {
	console.log('Server listening on port 8080.');
});
