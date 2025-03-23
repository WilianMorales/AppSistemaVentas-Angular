import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'chart.js';
import { catchError, of } from 'rxjs';
import { DashboardService } from 'src/app/data/services/dashboard.service';
import { UtilidadService } from 'src/app/shared/utilidad.service';
Chart.register(...registerables);

interface CardData {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

interface VentaUltimaSemana {
  fecha: string;
  total: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  cards: CardData[] = [
    { icon: 'payments', iconColor: 'accent', title: 'Total Ingresos', subtitle: '$' },
    { icon: 'sell', iconColor: 'accent', title: 'Total Ventas', subtitle: '$' },
    { icon: 'collections_bookmark', iconColor: 'primary', title: 'Total Productos', subtitle: '' }
  ];

  chartBarras: Chart | null = null;
  totalIngresos: number = 0;
  totalVentas: number = 0;
  totalProductos: number = 0;

  constructor(
    private _dashboardService: DashboardService,
    private _utilidadServicio: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerResumen();
  }
  private obtenerResumen(): void {
    this._dashboardService.obtenerResumen()
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.actualizarDatosTarjetas(data.value);
            this.actualizarGrafico(data.value.ventasUltimaSemana);
          } else {
            this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
          }
        },
        error: () => {
          this._utilidadServicio.mostrarAlerta('Hubo un error al obtener los datos', 'error');
        }
      });
  }

  actualizarDatosTarjetas(data: any): void {
    this.totalIngresos = data.totalIngresos;
    this.totalVentas = data.totalVentas;
    this.totalProductos = data.totalProductos;

    this.cards[0].subtitle = `$ ${this.totalIngresos}`;
    this.cards[1].subtitle = `$ ${this.totalVentas}`;
    this.cards[2].subtitle = `${this.totalProductos}`;
  }

  actualizarGrafico(ventasUltimaSemana: VentaUltimaSemana[]): void {
    const labelTemp = ventasUltimaSemana.map((value) => value.fecha);
    const dataTemp = ventasUltimaSemana.map((value) => value.total);
    this.displayChart(labelTemp, dataTemp);
  }

  displayChart(labelGrafico: string[], dataGrafico: number[]): void {
    // Si ya existe un gráfico, destrúyelo antes de crear uno nuevo
    if (this.chartBarras) {
      this.chartBarras.destroy();  // Destruir el gráfico anterior si existe
    }

    // Crear un nuevo gráfico con los datos proporcionados
    this.chartBarras = new Chart('chartBarras', {
      type: 'bar',
      data: {
        labels: labelGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    })
  }

}
