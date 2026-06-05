import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AiClassifierService {

  classify(text: string): { category: string; priority: string } {

    // ✅ Safety check (prevents runtime errors)
    if (!text) {
      return { category: 'OTHER', priority: 'Low' };
    }

    const t = text.toLowerCase();

    // 🔐 LOGIN
    if (
      t.includes('login') ||
      t.includes('auth') ||
      t.includes('token') ||
      t.includes('session')
    ) {
      return { category: 'LOGIN', priority: 'High' };
    }

    // 🌐 NETWORK
    if (
      t.includes('network') ||
      t.includes('timeout') ||
      t.includes('api')
    ) {
      return { category: 'NETWORK', priority: 'High' };
    }

    // 🗄️ DATABASE
    if (
      t.includes('database') ||
      t.includes('db') ||
      t.includes('query') ||
      t.includes('connection')
    ) {
      return { category: 'DATABASE', priority: 'High' };
    }

    // 🖥️ UI
    if (
      t.includes('button') ||
      t.includes('ui') ||
      t.includes('dashboard')
    ) {
      return { category: 'UI', priority: 'Medium' };
    }

    // 🧪 TESTING
    if (
      t.includes('test') ||
      t.includes('unexpected')
    ) {
      return { category: 'TESTING', priority: 'Medium' };
    }

    // 🔹 DEFAULT
    return { category: 'OTHER', priority: 'Low' };
  }
}
