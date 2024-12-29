import { Component, OnInit } from '@angular/core';
import Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
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
  selector: 'app-graph',
  templateUrl: './graph.component.html',
})
export class GraphComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  employees: Employee[] = [];
  weeklyPerformance: WeeklyPerformance[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  // gets data from the API

  fetchData(): void {
    this.http.get<Employee[]>('http://localhost:3000/employees').subscribe((employees) => {
      this.employees = employees;
      this.fetchWeeklyPerformance();
    });
  }

  //gets weekly performances from the API

  fetchWeeklyPerformance(): void {
    this.http.get<WeeklyPerformance[]>('http://localhost:3000/weekly_performance').subscribe((performanceData) => {
      this.weeklyPerformance = performanceData;
      this.prepareChartData();
    });
  }

  prepareChartData(): void {
    const seriesData: any[] = [];

    // Path of each employee and their corresponding performances
    this.employees.forEach((employee) => {
      const performance = this.weeklyPerformance.filter((perf) => perf.employee_id === employee.id);

      // Sorting of the data for Highcharts to function

      const tipsData: number[] = [];
      const hoursData: number[] = [];

      // Filling the tips and hours data according to weekly performances

      for (let i = 1; i <=48; i++) {  // We'll consider the bar doesn't need data further than a year before the current date
        const perfForWeek = performance.find((perf) => perf.week === i);
        tipsData.push(perfForWeek ? perfForWeek.tips : 0); // If the employee did not work the week corresponding, we add 0
        hoursData.push(perfForWeek ? perfForWeek.hour : 0); // Likewise for the hours worked
      }

      // We add a series for each employee
      seriesData.push(
        {
          name: `${employee.first_name} ${employee.last_name} - Tips`,
          data: tipsData,
          type: 'line',
        },
        {
          name: `${employee.first_name} ${employee.last_name} - Hours`,
          data: hoursData,
          type: 'line',
        }
      );
    });

    // Configuration of the graph
    this.chartOptions = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Weekly performance',
      },
      xAxis: {
        categories: ['Week', 'Week 2'], // Catégories des semaines
      },
      series: seriesData,
    };
  }
}
