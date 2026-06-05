import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiClassifierService } from '../services/ai-classifier';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-dashboard.html',
  styleUrls: ['./ai-dashboard.css']
})
export class AiDashboardComponent implements OnInit {

  issues: any[] = [];
  summary: any = {};
  heatmap: any = {};

  objectKeys = Object.keys;

  selectedCategory: string = '';
  filteredIssues: any[] = [];

  // ✅ NEW → heatmap fixed slots
  timeSlots: string[] = ['09:00', '11:00', '14:00', '18:00'];

  constructor(private ai: AiClassifierService) { }

  ngOnInit(): void {

    const inputData = [
      "User unable to login due to expired token",
      "Login failed invalid username or password",
      "Authentication error session timeout",
      "Application is slow and API timeout issue",
      "Network issue server not responding",
      "Database connection failed query not working",
      "DB error connection timeout issue",
      "Dashboard button not working properly",
      "Test case failed unexpected output in application"
    ];

    this.processIssues(inputData);

    // Charts
    setTimeout(() => {
      this.createCharts();
    }, 500);

    this.checkAlerts();

    // Auto refresh
    setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  // 🔥 PROCESS DATA
  processIssues(data: string[]) {

    let result: any = {};

    data.forEach(text => {

      const classified = this.ai.classify(text);

      const issue = {
        text,
        category: classified.category,
        priority: classified.priority,
        time: this.generateTime()
      };

      this.issues.push(issue);

      // SUMMARY
      if (!result[classified.category]) {
        result[classified.category] = {
          total: 0,
          High: 0,
          Medium: 0,
          Low: 0
        };
      }

      result[classified.category].total++;
      result[classified.category][classified.priority]++;

      // HEATMAP
      if (!this.heatmap[issue.time]) {
        this.heatmap[issue.time] = 0;
      }
      this.heatmap[issue.time]++;
    });

    this.summary = result;
    this.filteredIssues = this.issues;
  }

  // 🔥 FILTER
  filterByCategory(category: string) {
    this.selectedCategory = category;
    this.filteredIssues = this.issues.filter(i => i.category === category);
  }

  showAll() {
    this.selectedCategory = '';
    this.filteredIssues = this.issues;
  }

  // 🔥 TIME GENERATOR
  generateTime(): string {
    const times = ['09:00', '11:00', '14:00', '18:00'];
    return times[Math.floor(Math.random() * times.length)];
  }

  // 🎨 VISUAL HEATMAP COLOR
  getHeatColor(count: number): string {

    if (count >= 5) return '#ff3b3b';   // 🔴 High
    if (count >= 3) return '#ff9800';   // 🟠 Medium
    if (count >= 1) return '#4caf50';   // 🟢 Low

    return '#2a2a3d'; // No data
  }

  // 📊 CHARTS
  createCharts() {

    const labels = this.objectKeys(this.summary);
    const data = labels.map(k => this.summary[k].total);

    // BAR
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Issues',
          data
        }]
      }
    });

    // PIE
    let high = 0, medium = 0, low = 0;

    this.issues.forEach(i => {
      if (i.priority === 'High') high++;
      else if (i.priority === 'Medium') medium++;
      else low++;
    });

    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['High', 'Medium', 'Low'],
        datasets: [{
          data: [high, medium, low]
        }]
      }
    });
  }

  // 🚨 ALERT
  checkAlerts() {

    const loginHigh = this.issues.filter(i =>
      i.category === 'LOGIN' && i.priority === 'High'
    ).length;

    if (loginHigh >= 5) {
      alert('🚨 CRITICAL: Authentication system unstable!');
    }
  }

  // 🔄 REFRESH
  refreshData() {

    this.issues = [];
    this.summary = {};
    this.heatmap = {};
    this.filteredIssues = [];

    this.ngOnInit();
  }
}
