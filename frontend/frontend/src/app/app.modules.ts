import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { TableComponent } from './table/table.component';
import { GraphComponent } from './graph/graph.component';
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
    AgGridAngular
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
