import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix';

const refs = {
  start: document.querySelector('button[data-start]'),
  input: document.querySelector('#datetime-picker'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
  notification: document.querySelector('.notification'),
};

let currentTime = null;
let selectedTime = null;
let timerId = null;
refs.start.addEventListener('click', timeStart);
refs.start.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    timeCheck(selectedDates);
  },
};
flatpickr('#datetime-picker', options);

function timeCheck(selectedDates) {
  selectedTime = selectedDates[0].getTime();
  currentTime = Date.now();
  if (selectedTime < currentTime) {
    return Notify.warning('Please choose a date in the future');
  } else {
    refs.start.disabled = false;
  }
}

function timeStart() {
  refs.input.disabled = true;
  refs.start.disabled = true;

  timerId = setInterval(() => {
    currentTime = Date.now();
    const deltaTime = selectedTime - currentTime;
    if (selectedTime <= currentTime) {
      clearInterval(timerId);
      return;
    }
    const time = convertMs(deltaTime);
    timeUpdate(time);
  }, 1000);
}

function timeUpdate({ days, hours, minutes, seconds }) {
  refs.days.textContent = `${days}`;
  refs.hours.textContent = `${hours}`;
  refs.minutes.textContent = `${minutes}`;
  refs.seconds.textContent = `${seconds}`;
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));
  return { days, hours, minutes, seconds };
}
