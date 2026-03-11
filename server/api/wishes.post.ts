import { addWish } from '~/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, message } = body;

    if (!name || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name and message are required',
      });
    }

    await addWish(name, message);

    return { success: true };
  } catch (error) {
    console.error('Error adding wish:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add wish',
    });
  }
});
