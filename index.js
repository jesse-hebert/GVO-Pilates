function initAnalogClock() {
  const clocks = document.querySelectorAll('[data-analog-clock-init]');
  if (!clocks.length) return;

  const defaultTimezone = 'Europe/Amsterdam';

  clocks.forEach((clock) => {
    const timezone = clock.getAttribute('data-analog-clock-init') || defaultTimezone;
    const hourHand = clock.querySelector('[data-analog-clock-hour]');
    const minuteHand = clock.querySelector('[data-analog-clock-minute]');
    const secondHand = clock.querySelector('[data-analog-clock-second]');

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    let previousSecond;
    let secondRotation;

    function updateClock() {
      const now = new Date();
      const parts = Object.fromEntries(
        formatter.formatToParts(now).map((part) => [part.type, part.value])
      );

      const hours = Number(parts.hour);
      const minutes = Number(parts.minute);
      const seconds = Number(parts.second);
      const milliseconds = now.getMilliseconds();

      const smoothSeconds = seconds + milliseconds / 1000;
      const smoothMinutes = minutes + smoothSeconds / 60;
      const smoothHours = (hours % 12) + smoothMinutes / 60;

      if (hourHand) hourHand.style.transform = `rotate(${smoothHours * 30}deg)`;
      if (minuteHand) minuteHand.style.transform = `rotate(${smoothMinutes * 6}deg)`;

      if (secondHand && seconds !== previousSecond) {
        if (previousSecond === undefined) {
          secondRotation = seconds * 6;
          secondHand.style.transition = 'none';
          secondHand.style.transform = `rotate(${secondRotation}deg)`;
          secondHand.offsetHeight;
          secondHand.style.transition = '';
        } else {
          secondRotation += 6;
          secondHand.style.transform = `rotate(${secondRotation}deg)`;
        }

        previousSecond = seconds;
      }

      requestAnimationFrame(updateClock);
    }

    updateClock();
  });
}

// Initialize Analog Clock
document.addEventListener('DOMContentLoaded', () => {
  initAnalogClock();
});