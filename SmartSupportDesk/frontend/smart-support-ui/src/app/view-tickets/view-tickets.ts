import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './view-tickets.html',
  styleUrls: ['./view-tickets.css']
})
export class ViewTicketsComponent implements OnInit {

  tickets: any[] = [];

  searchText: string = '';
  statusFilter: string = '';
  priorityFilter: string = '';

  apiUrl = 'http://localhost:5218/api/Ticket';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log(data); // Debug
        this.tickets = data;
      },
      error: () => alert('Error loading tickets')
    });
  }

  // ✅ FILTER
  get filteredTickets() {
    return this.tickets.filter(ticket => {
      return (
        (!this.searchText || ticket.title?.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (!this.statusFilter || ticket.status === this.statusFilter) &&
        (!this.priorityFilter || ticket.priority === this.priorityFilter)
      );
    });
  }

  updateStatus(id: number, status: string) {
    this.http.put(
      `${this.apiUrl}/status/${id}`,
      JSON.stringify(status),
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: () => {
        alert("✅ Status updated");
        this.loadTickets();
      },
      error: () => alert("❌ Update failed")
    });
  }

  deleteTicket(id: number) {
    if (!confirm("Are you sure?")) return;

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        alert("🗑️ Deleted");
        this.loadTickets();
      },
      error: () => alert("❌ Delete failed")
    });
  }

  // ✅ STATUS STYLE
  getStatusClass(status: string) {
    switch (status) {
      case 'New': return 'status-new';
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  }

  // ✅ PRIORITY STYLE
  getPriorityClass(priority: string) {
    switch (priority) {
      case 'Critical': return 'priority-critical';
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }

  // ✅ TYPE LABEL (NO BLANK)
  getTypeLabel(type: string): string {
    if (!type || type.trim() === '') {
      return 'General';
    }

    const t = type.toLowerCase();

    if (t.includes('login') || t.includes('auth')) return 'Incident';
    if (t.includes('network')) return 'Problem';
    if (t.includes('software') || t.includes('app')) return 'Service';
    if (t.includes('change')) return 'Change';

    return type;
  }

  // ✅ TYPE STYLE
  getTypeClass(type: string): string {
    if (!type || type.trim() === '') {
      return 'type-default';
    }

    const t = type.toLowerCase();

    if (t.includes('login') || t.includes('auth')) return 'type-incident';
    if (t.includes('network')) return 'type-problem';
    if (t.includes('software') || t.includes('app')) return 'type-service';
    if (t.includes('change')) return 'type-change';

    return 'type-default';
  }
}
