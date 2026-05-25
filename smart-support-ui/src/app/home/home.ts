import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  selectedHelp: any = null;

  constructor(private router: Router) { }

  goToCreate() {
    this.router.navigate(['/create-ticket']);
  }

  goToView() {
    this.router.navigate(['/view-tickets']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  goToAiSuggestion() {
    this.router.navigate(['/ai-suggestion']);
  }

  goToAiDashboard() {
    this.router.navigate(['/ai-dashboard']);
  }
  // 🔥 SELF-SERVICE KNOWLEDGE
  showHelp(type: string) {

    const helpData: any = {

      login: {
        title: '🔐 Login Issues',
        content: [
          'Reset your password using "Forgot Password"',
          'Clear browser cache and cookies',
          'Ensure Caps Lock is OFF',
          'Try a different browser'
        ]
      },

      network: {
        title: '🌐 Network Issues',
        content: [
          'Check your internet connection',
          'Restart your router',
          'Disable VPN if active',
          'Reconnect Wi-Fi'
        ]
      },

      software: {
        title: '💻 Software Errors',
        content: [
          'Restart the application',
          'Update to latest version',
          'Reinstall software',
          'Check compatibility'
        ]
      },

      search: {
        title: '🔍 Search Help',
        content: [
          'Try keywords like "login", "error"',
          'Use simple words',
          'Avoid spelling mistakes'
        ]
      },

      feedback: {
        title: '⭐ Feedback',
        content: [
          'We value your feedback!',
          'Share suggestions to improve system',
          'Contact admin if needed'
        ]
      }

    };

    this.selectedHelp = helpData[type];
  }
}
