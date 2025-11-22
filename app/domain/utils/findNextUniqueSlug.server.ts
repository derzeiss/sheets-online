export const findNextUniqueSlug = async <T extends Function>(
  findUnique: T,
  baseSlug: string,
  suffix = 0,
): Promise<string> => {
  // don't allow 'new' as we use it for creating a new blank setlist
  if (suffix === 0 && baseSlug === 'new') {
    return findNextUniqueSlug(findUnique, baseSlug, suffix + 1);
  }
  let slug = suffix === 0 ? baseSlug : `${baseSlug}-${suffix}`;

  const existingRecord = await findUnique({ where: { slug } });

  if (existingRecord) {
    return findNextUniqueSlug(findUnique, baseSlug, suffix + 1);
  }
  if (suffix >= 500) throw new Error('Tried 500 times, no slug found.'); // TODO: this will some day throw

  return slug;
};
