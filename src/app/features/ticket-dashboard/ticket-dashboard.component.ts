
import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';

import { TicketService } from '../../core/services/ticket';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonText,
  IonButton,
  IonList,
  IonItem,
  IonBadge
} from '@ionic/angular';

@Component({
  selector: 'app-ticket-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    IonText,
    IonButton,
    IonList,
    IonItem,
    IonBadge
  ],
  template: `
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>TechTicket FP</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-segment (ionChange)="cambiarFiltro($event)"
                   value="todos">
        <ion-segment-button value="todos">
          <ion-label>Todos</ion-label>
        </ion-segment-button>

        <ion-segment-button value="abiertos">
          <ion-label>Abiertos</ion-label>
        </ion-segment-button>

        <ion-segment-button value="cerrados">
          <ion-label>Cerrados</ion-label>
        </ion-segment-button>
      </ion-segment>

      @if (ticketService.isLoading()) {
        <div class="ion-text-center ion-margin-top">
          <ion-spinner name="dots"></ion-spinner>
          <p>Sincronizando incidencias...</p>
        </div>
      } @else if (ticketService.errorMessage()) {
        <div class="ion-text-center">
          <ion-text color="danger">
            <p>{{ ticketService.errorMessage() }}</p>
          </ion-text>

          <ion-button (click)="cargarDatos()" size="small">
            Reintentar
          </ion-button>
        </div>
      } @else {
        <ion-list>
          @for (ticket of ticketsFiltrados(); track ticket.id) {
            <ion-item>
              <ion-label>
                <h2>#{{ ticket.id }} - {{ ticket.title }}</h2>
              </ion-label>

              <ion-badge slot="end"
                         [color]="ticket.completed ? 'success' : 'warning'">
                {{ ticket.completed ? 'Resuelto' : 'Pendiente' }}
              </ion-badge>
            </ion-item>
          } @empty {
            <ion-item>
              <ion-label>No hay incidencias en esta vista.</ion-label>
            </ion-item>
          }
        </ion-list>
      }

    </ion-content>
  `
})
export class TicketDashboardComponent implements OnInit {

  public ticketService = inject(TicketService);

  public filtroActual = signal<'todos' | 'abiertos' | 'cerrados'>('todos');

  public ticketsFiltrados = computed(() => {
    const data = this.ticketService.tickets();
    const filtro = this.filtroActual();

    if (filtro === 'abiertos') {
      return data.filter(t => !t.completed);
    }

    if (filtro === 'cerrados') {
      return data.filter(t => t.completed);
    }

    return data;
  });

  ngOnInit() {
    this.cargarDatos();
  }

  public cargarDatos(): void {
    this.ticketService.fetchTickets();
  }

  public cambiarFiltro(event: any): void {
    this.filtroActual.set(event.detail.value);
  }
}
