import {Component, computed, Signal, signal} from '@angular/core';
import {ISmallInformationCard} from "@models/cardInformation";
import {Chart, registerables} from "chart.js";
import {DashboardService} from "@services/dashboard.service";
import {ApiResponse} from "@models/application";
import {OrderData} from "@models/dashboard";
import {formatCurrency} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  dashboardCards = signal<OrderData>(
    {
      totalClients: 0,
      totalUsers: 0,
      totalServices: 0,
    }
  );

  constructor(private readonly _dashboardService: DashboardService) {}

  itemsShopping: Signal<ISmallInformationCard[]> = computed<ISmallInformationCard[]>(() => [
    {
      icon: 'fa-solid fa-users',
      icon_description: 'fa-solid fa-users',
      background: '#FC9108',
      title: this.dashboardCards().totalClients,
      category: 'Clientes',
      description: 'Total de clientes',
    },
    {
      icon: 'fa-solid fa-user-gear',
      icon_description: 'fa-solid fa-user-gear',
      background: '#E9423E',
      title: this.dashboardCards().totalUsers,
      category: 'Colaboradores',
      description: 'Total de colaboradores',
    },
    {
      icon: 'fa-solid fa-photo-film',
      icon_description: 'fa-solid fa-photo-film',
      background: '#4CA750',
      title: this.dashboardCards().totalServices,
      category: 'Serviços',
      description: 'Total de Serviços do mês',
    },
  ]);
  
  lineChart: any = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Serviços',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  };

  barChart: any = {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Serviços',
        data: [10, 150, 180, 300, 170, 80, 240, 250, 150, 210, 180, 190], // Dados de Serviços por mês
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  };
  filters: any = {
    is_home: true
  };

  ngOnInit() {
    this.initChart();

    this._dashboardService
      .getDashboardCards()
      .subscribe((c: ApiResponse<OrderData>) => {
        this.dashboardCards.set(c.data);
      });
  }

  public initChart(){
    Chart.register(...registerables);

    this.barChart = new Chart('barChart', this.barChart);

    this._dashboardService.graphic().subscribe((c: ApiResponse<{ month: string, total: number }[]>) => {
      const months = c.data.map(d => d.month);
      const totals = c.data.map(d => d.total);

      if (this.barChart && this.barChart instanceof Chart) {
        this.barChart.data.labels = months;
        this.barChart.data.datasets[0].data = totals;
        this.barChart.update();
      }
    });
  }


}
