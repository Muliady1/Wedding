import { deleteWish } from '~/utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    });
  }

  await deleteWish(id);

  return { success: true };
});
