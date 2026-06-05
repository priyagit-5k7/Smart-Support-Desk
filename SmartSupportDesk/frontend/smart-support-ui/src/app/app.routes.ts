import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';

import { HomeComponent } from './home/home';
import { CreateTicketComponent } from './create-ticket/create-ticket';
import { ViewTicketsComponent } from './view-tickets/view-tickets';
import { DashboardComponent } from './dashboard/dashboard';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';
import { AiSuggestionComponent } from './ai-suggestion/ai-suggestion';
import { AiDashboardComponent } from './ai-dashboard/ai-dashboard';

export const routes: Routes = [

  {
    path: '',
    component: LayoutComponent,
    children: [

      { path: '', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'create-ticket', component: CreateTicketComponent },
      { path: 'view-tickets', component: ViewTicketsComponent },
      { path: 'ticket/:id', component: TicketDetailsComponent },
      { path: 'ai-dashboard', component: AiDashboardComponent },
      { path: 'ai-suggestion', component: AiSuggestionComponent }

    ]
  },

  { path: '**', redirectTo: '' }
];
