import { Component } from '@angular/core';
import { TicketBoard } from './ticket-board/ticket-board';

@Component({
  selector: 'app-root',
  imports: [TicketBoard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
