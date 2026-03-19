async function _uniqueUsername(base) {
  let candidate = base;
  let suffix = 1;

  while (await Profile.exists({ userName: candidate })) {
    candidate = `${base}_${suffix++}`;
  }

  return candidate;
}
