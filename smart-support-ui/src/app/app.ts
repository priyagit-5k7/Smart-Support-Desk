import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <h1>Smart Support Desk</h1>

    <a routerLink="/create-ticket">Create Ticket</a> |
    <a routerLink="/view-tickets">View Tickets</a> |
    <a routerLink="/dashboard">Dashboard</a>

    <hr>

    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
