import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

let users: any[] = [];

app.post('/users', (request, response) => {
  const { body } = request;

  if (!!body.email === false || !!body.name === false) {
    return response
      .status(400)
      .json({ message: 'Error: Make sure you nave email and name' });
  }

  if (users.find((user) => (user.email = body.email))) {
    return response.status(409).json({
      message: 'User with this email has already been added',
    });
  }

  const user = { ...request.body, id: Date.now() };

  users.push(user);

  return response
    .status(201)
    .send({ message: 'User created successfully', userCreated: user });
});

app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  if (!!body.email === false || !!body.name === false) {
    return res
      .status(400)
      .json({ message: 'Error: Make sure you have email and name' });
  }

  let user = users.find((user) => user.id === parseInt(id));

  if (!user) {
    return res.status(404).json({
      message: 'Error: User not found',
    });
  }

  if (users.find((user) => user.email === body.email)) {
    return res.status(409).json({
      message: 'User with this email has already been added',
    });
  }

  users = users.filter((user) => user.id !== parseInt(id));
  user = { ...user, ...body };
  users.push(user);

  return res.json({
    message: 'Updated successfully',
    updatedUser: user,
  });
});

app.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  users = users.filter((user) => user.id !== parseInt(id));

  return res.json({
    message: 'User deleted successfully',
  });
});

app.get('/users', (_, response) => {
  response.send(users);
});

app.get('/', (request, response) => {
  response.send({ up: true });
});

app.listen(process.env.PORT || 7001, () =>
  console.log(`listening on port ${process.env.PORT || 7001}`)
);
