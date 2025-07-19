function convertMinutesToSeconds(time: string) {
  const minutesNumber = parseInt(time);
  return minutesNumber * 60;
}

function convertSecondsToTime(seconds: number) {
  const minutesString = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secondsString = (seconds % 60).toString().padStart(2, '0');
  return `${minutesString}:${secondsString}`;
}

export { convertMinutesToSeconds, convertSecondsToTime };
