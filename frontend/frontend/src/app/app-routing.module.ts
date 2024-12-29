import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TableComponent } from './table/table.component';
import { GraphComponent } from './graph/graph.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Welcome page
  { path: 'tables', component: TableComponent }, // Tables page
  { path: 'graphs', component: GraphComponent }  // Page with the stats of employees
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }