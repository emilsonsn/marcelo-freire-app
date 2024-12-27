import {Component, ElementRef, Renderer2} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Subscription} from "rxjs";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {ApiResponse} from "@models/application";
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {

  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/painel/home',
      active: true
    },
    {
      label: 'Serviços',
      icon: 'fa-solid fa-photo-film',
      route: '/painel/services'
    },
    {
      label: 'Colaboradores',
      icon: 'fa-solid fa-user-tie',
      route: '/painel/collaborator'
    },
    {
      label: 'Clientes',
      icon: 'fa-solid fa-people-group',
      route: '/painel/client'
    },
  ]

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery : SessionQuery
  ) { }


  ngOnInit(): void {

    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe(user => {
      if(user) {
        this.user = user;

        if(user?.role == 'Manager')
          this.permitedMenuItem = this.menuItem.filter(item =>
            item.label !== 'Usuários'
          );
        else
          this.permitedMenuItem = this.menuItem;
      }
    })

  }


  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

}
