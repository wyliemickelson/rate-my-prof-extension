export const getRatingColor = (profData) => {
  if (profData.numRatings === 0) return 'rmp-helper-grey'
  if (profData.avgRating >= 4.0) return 'rmp-helper-green'
  if (profData.avgRating >= 3.0) return 'rmp-helper-yellow'
  if (profData.avgRating < 3.0) return 'rmp-helper-red'
}

export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}