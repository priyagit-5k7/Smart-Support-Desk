
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-suggestion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ai-suggestion.html',
  styleUrls: ['./ai-suggestion.css']
})
export class AiSuggestionComponent {

  issueText: string = '';
  response: any = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  // 🔥 MAIN FUNCTION
  analyzeIssue() {

    // ✅ Prevent empty input
    if (!this.issueText || !this.issueText.trim()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.response = null;

    const inputText = this.issueText.trim();

    this.http.post<any>('http://localhost:5218/ai-suggestion', {
      text: inputText
    }).subscribe({
      next: (res) => {
        this.response = res;
        this.loading = false;
      },

      error: (err) => {
        console.error('AI API Error:', err);

        // ✅ USER-FRIENDLY ERROR
        this.errorMessage = '⚠️ Unable to fetch AI suggestion. Please try again.';
        this.loading = false;
      }
    });
  }

  // 🔥 AUTO-FILL EXAMPLES (for moving nav)
  setExample(text: string) {
    this.issueText = text;
  }

  // 🔥 COPY SOLUTION
  copySolution() {
    if (this.response?.solution) {
      const text = this.response.solution.join('\n');
      navigator.clipboard.writeText(text);
    }
  }

  // 🔥 NAVIGATE TO CREATE TICKET
  goToCreateTicket() {
    window.location.href = '/create-ticket';
  }

}
