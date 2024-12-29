import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-midias',
  templateUrl: './midias.component.html',
  styleUrl: './midias.component.scss'
})
export class MidiasComponent implements OnInit{

  service_id: number;

  constructor(
    private _route: ActivatedRoute,
    // private midiaService: Midia
    
  ){}

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.service_id = params['id'];
      
    });
  }
  

}
