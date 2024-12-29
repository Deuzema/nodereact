import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  salary: number;
}

interface WeeklyPerformance {
  id: number;
  employee_id: number;
  week: number;
  tips: number;
  hour: number;
}

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
})
export class TablesComponent implements OnInit {
  private gridApi!: GridApi;
  rows$: Employee[] = [];
  colDefs: ColDef[] = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'First Name', field: 'first_name' },
    { headerName: 'Last Name', field: 'last_name' },
    { headerName: 'Salary', field: 'salary' },
  ];

  newEmployee: Employee = { id: 0, first_name: '', last_name: '', salary: 0 };
  newPerformance: WeeklyPerformance = { id: 0, employee_id: 0, week: 0, tips: 0, hour: 0 };

  isAddEmployeeFormVisible = false;
  isAddPerformanceFormVisible = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  fetchEmployees() {
    this.http.get<Employee[]>('http://localhost:3000/employees').subscribe(
      (data) => {
        this.rows$ = data;
        this.gridApi.setRowData(this.rows$);
      },
      (error) => console.error('Error fetching employees', error)
    );
  }

  toggleAddEmployeeForm() {
    this.isAddEmployeeFormVisible = !this.isAddEmployeeFormVisible;
  }

  toggleAddPerformanceForm() {
    this.isAddPerformanceFormVisible = !this.isAddPerformanceFormVisible;
  }

  addEmployee() {
    const newEmployee = { ...this.newEmployee };
    this.http.post('http://localhost:3000/employees', newEmployee).subscribe((employee: Employee) => {
      this.rows$.push(employee);
      this.gridApi.setRowData(this.rows$);
      this.toggleAddEmployeeForm(); // Hides the textblock after adding an employee
      this.newEmployee = { id: 0, first_name: '', last_name: '', salary: 0 }; // This resets the textblock
    });
  }

  addPerformance() {
    const performance = { ...this.newPerformance };
    this.http.post('http://localhost:3000/weekly_performance', performance).subscribe((performance: WeeklyPerformance) => {
      this.toggleAddPerformanceForm(); // Hides the textblock after adding a weekly performance
      this.newPerformance = { id: 0, employee_id: 0, week: 0, tips: 0, hour: 0 }; // Resets the textblock
    });
  }

  deleteEmployee() {
    const selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows.length > 0) {
      const employeeId = selectedRows[0].id;
      this.http.delete(`http://localhost:3000/employees/${employeeId}`).subscribe(() => {
        this.rows$ = this.rows$.filter((emp) => emp.id !== employeeId);
        this.gridApi.setRowData(this.rows$);
      });
    }
  }

  updateEmployee() {
    if (!this.selectedEmployee) {
      return;
    }
    this.http.put(`${environment.apiUrl}/employees/${this.selectedEmployee.id}`, this.selectedEmployee)
      .subscribe((response) => {
        console.log('Employee updated', response);
        // Actualise the table
      });
    goBack()
    {
      this.router.navigate(['/']);
    }
  }

  updatePerformance() {
    if (this.selectedPerformance) {
      this.http.put(`/api/weekly_performance/${this.selectedPerformance.id}`, this.selectedPerformance)
        .subscribe((response) => {
          console.log('Performance updated', response);
          // Actualise the performances
        });
    }
  }

