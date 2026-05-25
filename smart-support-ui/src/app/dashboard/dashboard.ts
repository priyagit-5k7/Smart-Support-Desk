import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  data: any = {};
  recentTickets: any[] = [];

  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadAnalytics();
    this.loadRecentTickets();
  }

  loadAnalytics() {
    this.http.get('http://localhost:5218/api/Ticket/analytics')
      .subscribe({
        next: (res: any) => {
          this.data = res;
          setTimeout(() => this.initCharts(res), 100);
        },
        error: (err) => console.error('Error loading analytics: ', err)
      });
  }

  // 🔥 NEW - RECENT TICKETS
  loadRecentTickets() {
    this.http.get<any[]>('http://localhost:5218/api/Ticket')
      .subscribe({
        next: (res) => {
          this.recentTickets = res.slice(-5).reverse(); // last 5 tickets
        },
        error: () => console.error('Error loading recent tickets')
      });
  }

  // 🔥 CLICKABLE CARDS
  filter(type: string) {
    alert('Filtering: ' + type);
  }

  initCharts(res: any) {

    // 🔵 LINE CHART
    if (res.byDay) {
      new Chart(this.lineChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: Object.keys(res.byDay),
          datasets: [{
            label: 'Tickets Over Time',
            data: Object.values(res.byDay),
            borderColor: '#1890ff',
            backgroundColor: 'rgba(24,144,255,0.3)',
            fill: true,
            tension: 0.4
          }]
        }
      });
    }

    // 🟠 BAR CHART
    new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Pending', 'Resolved', 'High Priority'],
        datasets: [{
          data: [
            res.pendingTickets || 0,
            res.resolvedTickets || 0,
            res.highPriorityTickets || 0
          ],
          backgroundColor: ['#faad14', '#52c41a', '#ff4d4f']
        }]
      },
      options: {
        plugins: { legend: { display: false } }
      }
    });

    // 🟣 DOUGHNUT CHART
    if (res.byAssignee) {
      new Chart(this.doughnutChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: Object.keys(res.byAssignee),
          datasets: [{
            data: Object.values(res.byAssignee),
            backgroundColor: [
              '#1890ff',
              '#52c41a',
              '#faad14',
              '#ff4d4f',
              '#722ed1'
            ]
          }]
        }
      });
    }
  }
}

