import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl} from '@models/application';
import {User, UserCards, UserPosition, UserSector, UserStatus} from '@models/user';
import {Utils} from '@shared/utils';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private sessionEndpoint: string = 'user';

  constructor(
    private readonly _http: HttpClient
  ) {}

  public getUsers(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<User>> {
    const params: any = {
      page: pageControl?.page?.toString() || '1',
      take: pageControl?.take?.toString() || '10',
      orderField: pageControl?.orderField || 'id',
      order: pageControl?.order || 'ASC',
      search_term: pageControl?.search_term || '' // Adiciona o search_term
    };

    if (filters) {
      Object.assign(params, filters);
    }

    return this._http.get<ApiResponsePageable<User>>(
      `${environment.api}/${this.sessionEndpoint}/search`,
      { params }
    );
  }

  public getCards(): Observable<ApiResponse<UserCards>> {
    return this._http.get<ApiResponse<UserCards>>(`${environment.api}/${this.sessionEndpoint}/cards`);
  }

  public getUser(): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/me`);
  }

  public getUserById(id: number): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public postUser(user: User): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/create`, user);
  }

  public patchUser(id: number, user: FormData): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, user);
  }

  public updateStatus(id: number, newStatus: UserStatus): Observable<ApiResponse<User>> {
    return this._http.patch<ApiResponse<User>>(`${environment.api}/${this.sessionEndpoint}/status/${id}`, { status: newStatus });
  }

  public deleteUser(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }

  public inviteUser(email: string, cellphone: number): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${environment.api}/${this.sessionEndpoint}/invite`, {
      email: email,
      cellphone: cellphone
    });
  }

  recoverPassword(email: string): Observable<any> {
    return this._http.post<any>(`${environment.api}/recoverPassword`, { email });
  }

  public resetPassword(token: string, password: string): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${environment.api}/open/${this.sessionEndpoint}/reset-password/${token}`, { password: password });
  }

  public validateCode(code: string): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${environment.api}/validate-code?_method=GET`, { code });
  }

  public validateToken(token: string): Observable<ApiResponse<string>> {
    return this._http.post<ApiResponse<string>>(`${environment.api}/open/${this.sessionEndpoint}/check-token`, { token: token });
  }

  public getPositionsUser(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<UserPosition>> {
    return this._http.get<ApiResponsePageable<UserPosition>>(`${environment.api}/${this.sessionEndpoint}/position/search`);
  }

  public postPositionUser(position: UserPosition): Observable<ApiResponse<UserPosition>> {
    return this._http.post<ApiResponse<UserPosition>>(`${environment.api}/${this.sessionEndpoint}/position/create`, position);
  }

  public deletePositionUser(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/position/${id}`);
  }

  public getSectorsUser(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<UserSector>> {
    return this._http.get<ApiResponsePageable<UserSector>>(`${environment.api}/${this.sessionEndpoint}/sector/search`);
  }

  public postSectorUser(position: UserSector): Observable<ApiResponse<UserSector>> {
    return this._http.post<ApiResponse<UserSector>>(`${environment.api}/${this.sessionEndpoint}/sector/create`, position);
  }

  public deleteSectorUser(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/sector/${id}`);
  }

  getUsersAll(): Observable<ApiResponse<User[]>> {
    return this._http.get<ApiResponse<User[]>>(`${environment.api}/${this.sessionEndpoint}/all`);
  }

  updatePassword(data: { code: string, password: string }): Observable<any> {
    return this._http.post<any>(`${environment.api}/updatePassword`, data);
  }
}
