export const cx = (...args: Array<null | undefined | string | Record<string, boolean>>) =>
  args
    .map((curr) => {
      if (curr === null || curr === undefined) return '';
      if (typeof curr === 'string') return curr;
      if (curr.value !== undefined) curr = curr.value + '';
      return Object.entries(curr)
        .filter(([_cls, shouldAdd]) => shouldAdd)
        .map(([cls]) => cls)
        .join(' ');
    })
    .join(' ');
