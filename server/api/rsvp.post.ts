import { addRsvp } from '~/utils/db';
import { attendanceOptions } from '~/composables/useData';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, guests, attendance } = body;

    // Validate attendance against allowed options from useData
    const validAttendance = attendanceOptions.map(opt => opt.value);
    if (!name || !attendance) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and attendance are required',
      });
    }

    if (!validAttendance.includes(attendance)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid attendance option',
      });
    }

    await addRsvp(name, guests || 1, attendance);

    return { success: true };
  } catch (error) {
    console.error('Error adding RSVP:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add RSVP',
    });
  }
});
