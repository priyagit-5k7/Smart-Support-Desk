
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private baseUrl = 'http://localhost:5218/api/Tickets';

  constructor(private http: HttpClient) { }

  // Get all tickets
  getAllTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  // Get ticket by ID
  getTicketById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}
