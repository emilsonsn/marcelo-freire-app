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
    return this._http.get<ApiResponsePageable<Midea>>(`${environment.api}/${this.sessionEndpoint}/search`);
  }

  public create(midea: Midea): Observable<ApiResponse<Midea>> {
    return this._http.post<ApiResponse<Midea>>(`${environment.api}/${this.sessionEndpoint}/create`, midea);
  }

  public update(id: number, midea: Midea): Observable<ApiResponse<Midea>> {
    return this._http.patch<ApiResponse<Midea>>(`${environment.api}/${this.sessionEndpoint}/${id}`, midea);
  }

  public delete(id: number): Observable<DeleteApiResponse> {
    return this._http.delete<DeleteApiResponse>(`${environment.api}/${this.sessionEndpoint}/${id}`);
  }
}