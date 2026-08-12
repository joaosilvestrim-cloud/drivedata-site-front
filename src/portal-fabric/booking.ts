// Agenda pública (Microsoft Bookings) da demonstração do Portal Fabric.
// Os agendamentos caem direto no Outlook do time. Trocar a URL aqui atualiza
// todos os botões "Agendar" da landing de uma vez.
export const BOOKING_URL = 'https://outlook.office.com/book/DemonstraoPortalFabric2@drivedata.com.br/';

/** Abre a agenda do Bookings numa aba nova. */
export function openBooking() {
  if (typeof window !== 'undefined') {
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
  }
}
