import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './create-ticket.html',
  styleUrls: ['./create-ticket.css']
})
export class CreateTicketComponent {

  title: string = '';
  description: string = '';
  status: string = 'New';
  priority: string = '';
  category: string = '';
  file: File | null = null;
  ticketNumber: string = '';

  apiUrl = 'http://localhost:5218/api/Ticket';

  constructor(private http: HttpClient) {
    this.generateTicketNumber();
  }

  /** Auto-generate ticket number */
  generateTicketNumber() {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    this.ticketNumber = `TCK-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
  }

  /** Handle file selection */
  onFileChange(event: any) {
    this.file = event.target.files?.[0] || null;
    if (this.file) {
      console.log('Selected file:', this.file.name);
    }
  }

  /** Create ticket API call */
  createTicket() {
    if (!this.title || !this.description || !this.priority || !this.category) {
      alert('❌ Please fill all required fields');
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.title);
    formData.append('Description', this.description);
    formData.append('Status', this.status);
    formData.append('Priority', this.priority);
    formData.append('Category', this.category);
    formData.append('TicketNumber', this.ticketNumber);

    if (this.file) {
      formData.append('file', this.file);
    }

    this.http.post(this.apiUrl, formData).subscribe({
      next: (res) => {
        alert('✅ Ticket Created Successfully!');
        console.log(res);
        this.resetForm();
        this.generateTicketNumber();
      },
      error: (err) => {
        console.error(err);
        alert('❌ Ticket creation failed');
      }
    });
  }

  /** Reset form */
  resetForm() {
    this.title = '';
    this.description = '';
    this.status = 'New';
    this.priority = '';
    this.category = '';
    this.file = null;
  }
}
