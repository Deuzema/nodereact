import * as express from 'express';
import * as cors from 'cors';
import { Request, Response} from 'express';

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // to handle JSON type data

app.get('/', (req: Request, res: Response) => {
  res.send('Greetings'); // Example of a typical route
});

app.listen(3000, () => {
  console.log(`Server is running`);
});

// Connexion to Oracle and the sample database

import oracledb from 'oracledb';

async function Connect() {
  try {
    const connection = await oracledb.getConnection({
      user: 'SYSTEM',
      password: 'root',
      connectString: 'localhost:1521/SYSTEM', // You need to replace these with your own password, username and connectstring
    });
    return connection;
  } catch (err) {
    console.error('Erreur de connexion à la base de données Oracle:', err);
    throw err;
  }
}

// Coding of different CRUD requests regarding the employees table and the weekly_performance table

// Code to get the informations regarding an employee
app.get('/employees', async (req, res) => {
  try {
    const connection = await Connect();
    const result = await connection.execute('SELECT * FROM employees');
    res.json(result.rows); // Converting the employees to JSON
    await connection.close();
  } catch (err) {
    console.error('The employees do not exist', err);
    res.status(500).send('The employees do not exist');
  }
});

//Code to add an employee

app.post('/employees', async (req, res) => {
  const { first_name, last_name, salary } = req.body;

  try {
    const connection = await Connect();
    const result = await connection.execute(
        `INSERT INTO employees (first_name, last_name, salary)
       VALUES (:first_name, :last_name, :salary)`,
        [first_name, last_name, salary],
        { autoCommit: true }
    );
    res.status(201).send('Employee added');
    await connection.close();
  } catch (err) {
    console.error('The employee could not be added', err);
    res.status(500).send('The employee could not be added');
  }
});

// Code to get the weekly_performance table values

app.get('/weekly_performance/:employeeId', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const connection = await Connect();
    const result = await connection.execute(
        `SELECT * FROM weekly_performance WHERE employee_id = :employeeId`,
        [employeeId]
    );
    res.json(result.rows); // Converting the employee's performance to the JSON format
    await connection.close();
  } catch (err) {
    console.error('Could not fetch the weekly performances', err);
    res.status(500).send('Could not fetch the weekly performances');
  }
});

// Code to add a weekly performance of an employee

app.post('/weekly_performance', async (req, res) => {
  const { employee_id, week, tips, hour } = req.body;

  try {
    const connection = await Connect();
    const result = await connection.execute(
        `INSERT INTO weekly_performance (employee_id, week, tips, hour)
       VALUES (:employee_id, :week, :tips, :hour)`,
        [employee_id, week, tips, hour],
        { autoCommit: true }
    );
    res.status(201).send('Weekly performances added successfully');
    await connection.close();
  } catch (err) {
    console.error('Could not add weekly performance', err);
    res.status(500).send('Could not add weekly performance');
  }
});

//Code to update an employee status

app.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, salary } = req.body;

  try {
    const connection = await Connect();
    const result = await connection.execute(
        `UPDATE employees SET first_name = :first_name, last_name = :last_name, salary = :salary WHERE id = :id`,
        [first_name, last_name, salary, id],
        { autoCommit: true }
    );
    res.send('Employee profile successfully updated');
    await connection.close();
  } catch (err) {
    console.error('Could not update the employee profile', err);
    res.status(500).send('Could not update the employee profile');
  }
});

// Code pour supprimer un employé

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await Connect();
    const result = await connection.execute(
        `DELETE FROM employees WHERE id = :id`,
        [id],
        { autoCommit: true }
    );
    res.send('Employee successfully deleted');
    await connection.close();
  } catch (err) {
    console.error('Employee could not be deleted', err);
    res.status(500).send('Employee could not be deleted');
  }
});

