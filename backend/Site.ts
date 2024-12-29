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

// Establishment of a mock database to use

let employees = [
  { id: 1, first_name: 'Yannick', last_name: 'Dubois', salary: 1400 },
  { id: 2, first_name: 'Valentin', last_name: 'Dupont', salary: 1700 },
];


let weekly_performance = [
  { id: 1, employee_id: 1, week: 1, tips: 31.0, hour: 35 },
  { id: 2, employee_id: 1, week: 2, tips: 43.0, hour: 38 },
  { id: 3, employee_id: 2, week: 1, tips: 18.0, hour: 20 },
  { id: 4, employee_id: 2, week: 2, tips: 17.0, hour: 18 },
];

// Get information of all employees

app.get('/employees', (req, res) => {
  res.json(employees);
});

// Adding an employee

app.post('/employees', (req, res) => {
  const { first_name, last_name, salary } = req.body;
  const newEmployee = {
    id: employees.length + 1, // Creation of a new ID for the new employee
    first_name,
    last_name,
    salary,
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// 3. Updating an existing employee's profile

app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, salary } = req.body;

  const employeeIndex = employees.findIndex(emp => emp.id == id);
  if (employeeIndex !== -1) {
    employees[employeeIndex] = { id: Number(id), first_name, last_name, salary }; // Updates the employee
    res.json(employees[employeeIndex]);
  } else {
    res.status(404).send('Employee not found');
  }
});

// Deleting an employee from the table

app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const employeeIndex = employees.findIndex(emp => emp.id == id);
  if (employeeIndex !== -1) {
    const deletedEmployee = employees.splice(employeeIndex, 1);
    res.json(deletedEmployee); // Prints the deleted empployee
  } else {
    res.status(404).send('Employee not found');
  }
});

// Getting the weekly performances of an employee

app.get('/weekly_performance/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  const performance = weeklyPerformance.filter(
      performance => performance.employee_id == employeeId
  );
  if (performance.length > 0) {
    res.json(performance);
  } else {
    res.status(404).send('No data on this employee');
  }
});

// Add a weekly performance from an employee
app.post('/weekly_performance', (req, res) => {
  const { employee_id, week, tips, hour } = req.body;
  const newPerformance = {
    id: weeklyPerformance.length + 1, // Creates a new id
    employee_id,
    week,
    tips,
    hour,
  };
  weeklyPerformance.push(newPerformance);
  res.status(201).json(newPerformance); // show the added performance
});

// Updating a weekly performance

app.put('/weekly_performance/:id', (req, res) => {
  const { id } = req.params;
  const { employee_id, week, tips, hour } = req.body;

  const performanceIndex = weeklyPerformance.findIndex(perf => perf.id == id);
  if (performanceIndex !== -1) {
    weeklyPerformance[performanceIndex] = { id: Number(id), employee_id, week, tips, hour };
    res.json(weeklyPerformance[performanceIndex]);
  } else {
    res.status(404).send('Performance not found');
  }
});

// Delete a weekly performance

app.delete('/weekly_performance/:id', (req, res) => {
  const { id } = req.params;
  const performanceIndex = weeklyPerformance.findIndex(perf => perf.id == id);
  if (performanceIndex !== -1) {
    const deletedPerformance = weeklyPerformance.splice(performanceIndex, 1);
    res.json(deletedPerformance);
  } else {
    res.status(404).send('Performance not found');
  }
});
