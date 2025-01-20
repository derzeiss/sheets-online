/**
 * TODO: This is not safe (required fields can be omitted, can only handle strings)
 * @param values
 * @param allowedFields
 * @returns
 */
export const filterPrismaEntityValues = <T extends object>(
  values: Record<string, FormDataEntryValue>,
  allowedFields: (keyof T)[],
) =>
  Object.entries(values).reduce(
    (filtered, [key, val]) => {
      const key_typed = key as keyof T;
      if (allowedFields.includes(key_typed) && typeof val === 'string') filtered[key_typed] = val;
      return filtered;
    },
    {} as { [k in keyof T]: string },
  );
