import { getWishes } from '~/utils/db';

export default defineEventHandler(async (event) => {
  try {
    const wishes = await getWishes();
    return wishes;
  } catch (error) {
    console.error('Error fetching wishes:', error);
    return [];
  }
});
