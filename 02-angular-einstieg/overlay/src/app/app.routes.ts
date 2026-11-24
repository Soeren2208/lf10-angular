import { Routes } from '@angular/router';
import { TicketBoard } from './ticket-board/ticket-board';
import { TicketDetail } from './ticket-detail/ticket-detail';

export const routes: Routes = [
  { path: '', component: TicketBoard },
  { path: 'tickets/:id', component: TicketDetail },
  { path: '**', redirectTo: '' },
];
