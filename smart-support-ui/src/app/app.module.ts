import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Standalone components
import { CreateTicketComponent } from './create-ticket/create-ticket';
import { ViewTicketsComponent } from './view-tickets/view-tickets';
import { DashboardComponent } from './dashboard/dashboard';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';

@NgModule({
  declarations: [],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),

    AppComponent,
    CreateTicketComponent,
    ViewTicketsComponent,
    DashboardComponent,
    TicketDetailsComponent
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
