import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ApiResponsePageable, DeleteApiResponse, PageControl } from '@models/application';
import { Midea } from '@models/midea';
import { Utils } from '@shared/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MideaService {

  private sessionEndpoint: string = 'midea';  

  constructor(
    private readonly _http: HttpClient
  ) { }
  public search(pageControl?: PageControl, filters?: any): Observable<ApiResponsePageable<Midea>> {
    const paginate = Utils.mountPageControl(pageControl);
    const filterParams = Utils.mountPageControl(filters);
    return this._http.get<ApiResponsePageable<Midea>>(`${environment.api}/${this.sessionEndpoint}/search?${paginate}${filterParams}`);
  }

  public getByCode(code): Observable<ApiResponsePageable<Midea>> {    
    return this._http.get<ApiResponsePageable<Midea>>(`${environment.api}/${this.sessionEndpoint}/code/${code}`);
  }

  public create(midea: FormData): Observable<ApiResponse<Midea>> {
    return this._http.post<ApiResponse<Midea>>(`${environment.api}/${this.sessionEndpoint}/create`, midea);
  }

  public addComment(comment: Comment): Observable<ApiResponse<Comment>> {
    return this._http.post<ApiResponse<Comment>>(`${environment.api}/${this.sessionEndpoint}/add-comment`, comment);
  }
  

  public update(id: number, midea: FormData): Observable<ApiResponse<Midea>> {
    return this._http.post<ApiResponse<Midea>>(`${environment.api}/${this.sessionEndpoint}/${id}?_method=PATCH`, midea);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}