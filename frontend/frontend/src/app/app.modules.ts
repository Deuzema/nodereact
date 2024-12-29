import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { HomeComponent } from './Home/home.component';
import { TableComponent } from './Table/table.component';
import { GraphComponent } from './Graph/graph.component';
import { AgGridAngular } from 'ag-grid-angular'; // Import de AG-Grid

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TableComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AgGridAngular,
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
