import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, User } from '../models/user.model';
import { ApiResponse } from '../models/api.model';

const TOKEN_KEY = 'nep_token';
const USER_KEY  = 'nep_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly user     = this._user.asReadonly();
  readonly token    = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly role       = computed(() => this._user()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/api/v1/notification-engine/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          if (res.success) {
            const { accessToken, user } = res.data;
            localStorage.setItem(TOKEN_KEY, accessToken);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            this._token.set(accessToken);
            this._user.set(user);
          }
        }),
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/auth/login']);
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
