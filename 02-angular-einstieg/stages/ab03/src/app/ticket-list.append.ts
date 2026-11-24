
/** Alle Tickets mit dem Status `status`. */
export function ticketsWithStatus(tickets: readonly Ticket[], status: Status): Ticket[] {
  return tickets.filter((ticket) => ticket.status === status);
}
