import { Component } from '@angular/core';
import { sampleTickets } from './sample-data';
import { TicketCard } from './ticket-card/ticket-card';

@Component({
  selector: 'app-root',
  imports: [TicketCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly tickets = sampleTickets;
}
