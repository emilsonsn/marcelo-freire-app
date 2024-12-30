import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Midea } from '@models/midea';
import { MideaService } from '@services/midea.service';
import { DialogMideaComponent } from '@shared/dialogs/dialog-midea/dialog-midea.component';
import { DialogShowCommentsComponent } from '@shared/dialogs/dialog-show-comments/dialog-show-comments.component';

@Component({
  selector: 'app-mideas',
  templateUrl: './mideas.component.html',
  styleUrl: './mideas.component.scss'
})
export class MideasComponent implements OnInit{

  service_id: number;
  loading: boolean = false;
  mideas: Midea[];
  

  constructor(
    private _route: ActivatedRoute,
    private _mideaService: MideaService,
    private readonly _matDialog: MatDialog,
    private readonly _dialog: MatDialog
  ){}

  ngOnInit() {
    this._route.params.subscribe(params => {
      this.service_id = params['id'];
      this.getMidea();
  });

  }

  getMidea(){
    this._mideaService
    .search({}, {service_id : this.service_id})
    .subscribe({
      next: res => {
        this.mideas = res.data;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  openMideaDialog(midea?: any): void {
    const dialogConfig = new MatDialogConfig();

    const data = {
      service_id: this.service_id,
      midea      
    }
      
    dialogConfig.data = data || {};
      
    dialogConfig.width = '600px';
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
      
    this._matDialog
      .open(DialogMideaComponent, dialogConfig)
      .afterClosed()
      .subscribe((midea) => {
        if (midea) {
          if(midea.get('id')){
            this.updateMidea(midea.get('id'), midea);
          }else{
            this.createMidea(midea);
          }
        }
      });
  }

  createMidea(media: FormData){
    this._mideaService
    .create(media)
    .subscribe({
      next: res => {
        this.mideas.push(res.data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error('Error:', error);
      }
    })
  }
  
  updateMidea(id: number, media: FormData){
    this._mideaService
    .update(id, media)
    .subscribe({
      next: res => {
        this.mideas.push(res.data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        console.error('Error:', error);
      }
    })
  }

  isImage(path: string): boolean {
    return /\.(jpg|jpeg|png|gif|raw)$/i.test(path);
  }
  
  isVideo(path: string): boolean {
    return /\.(mov|mp4)$/i.test(path);
  }
  
  isAudio(path: string): boolean {
    return /\.(wav|mp3)$/i.test(path);
  }
  

  openCommentsDialog(comments: any): void {
    this._dialog.
    open(DialogShowCommentsComponent, {
      width: '600px',
      data: comments 
    });
  }
  

}
