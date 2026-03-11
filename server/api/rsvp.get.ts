import { getRsvps } from '~/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const rsvps = await getRsvps();
    
    // Calculate stats
    const stats = {
      total: rsvps.length,
      attending: rsvps.filter((r: any) => r.attendance === 'Hadir').reduce((acc: number, r: any) => acc + r.guests, 0),
      notAttending: rsvps.filter((r: any) => r.attendance === 'Tidak Hadir').length,
      uncertain: rsvps.filter((r: any) => r.attendance === 'Ragu-ragu').length,
      totalGuests: rsvps.filter((r: any) => r.attendance === 'Hadir').reduce((acc: number, r: any) => acc + r.guests, 0)
    };

    return { rsvps, stats };
  } catch (error) {
    console.error('Error fetching RSVP:', error);
    return { rsvps: [], stats: { total: 0, attending: 0, notAttending: 0, uncertain: 0, totalGuests: 0 } };
  }
});
