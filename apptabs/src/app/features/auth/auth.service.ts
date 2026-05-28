import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'budget_token';
  private readonly emailKey = 'budget_email';

  isConnected = signal(Boolean(localStorage.getItem(this.tokenKey)));
  userEmail = signal(localStorage.getItem(this.emailKey) || '');

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>('api/v1/auth/login', { email, password }).pipe(
      tap((response) => this.saveSession(response.token, response.user.email))
    );
  }

  register(email: string, password: string) {
    return this.http.post<{ userId: string }>('api/v1/auth/register', { email, password });
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    this.isConnected.set(false);
    this.userEmail.set('');
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  private saveSession(token: string, email: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.emailKey, email);
    this.isConnected.set(true);
    this.userEmail.set(email);
  }
}
