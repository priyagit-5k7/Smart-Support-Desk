import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

  ticket: any = null;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);   // 🔥 FIX TYPE ERROR
      this.loadTicket(id);
    });
  }

  loadTicket(id: number): void {

    console.log("Loading Ticket ID:", id);

    this.loading = true;
    this.ticket = null;

    this.http.get<any>(`http://localhost:5218/api/Ticket/${id}`)
      .subscribe({
        next: (data: any) => {
          console.log("API RESPONSE:", data);

          this.ticket = data;
          this.loading = false;

          this.cd.detectChanges(); // 🔥 UI refresh fix
        },
        error: (err: any) => {
          console.error("API ERROR:", err);

          this.ticket = null;
          this.loading = false;

          this.cd.detectChanges();
        }
      });
  }

  updateStatus(): void {

    if (!this.ticket) return;

    this.http.put(
      `http://localhost:5218/api/Ticket/status/${this.ticket.id}`,
      JSON.stringify(this.ticket.status),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).subscribe({
      next: () => alert("✅ Status updated successfully"),
      error: () => alert("❌ Failed to update status")
    });
  }
}
