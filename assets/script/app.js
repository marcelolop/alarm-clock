"use strict";

import { onEvent, select } from "./utility-functions.js";

// Grabbing the elements
const timeDisplay = select(".hour-alarm");
const alarmSetDisplay = select(".alarm-set");
const alarmHourInput = select(".set-alarm-hour");
const alarmMinuteInput = select(".set-alarm-minute");
const alarmSetButton = select(".set-alarm-btn");
const alarmMessage = select(".alarm-message");
const alarmSound = new Audio("./assets/media/alarm.mp3");
alarmSound.type = "audio/mp3";

// Displaying the current time on the clock
let alarmTime = null;
let isAlarmPlaying = false;

function displayTime() {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  timeDisplay.textContent = `${hour}:${minute}`;

  // Check if it's time to ring the alarm
  if (alarmTime && `${hour}:${minute}` === alarmTime) {
    if (!isAlarmPlaying) {
      isAlarmPlaying = true;
      alarmSound.play();
      clearMessage();
      alarmSetDisplay.textContent = "";
      timeDisplay.style.color = "green";
      setTimeout(() => {
        isAlarmPlaying = false;
        alarmSound.pause();
        alarmSound.currentTime = 0;
        timeDisplay.style.color = "";
      }, 11500);
      alarmTime = null; // Clear the alarm time
    }
  }
}

setInterval(displayTime, 1000);

// Refactored validation of the inputs before setting the alarm
function validateInputs() {
  // Validate hours
  function validateHours() {
    const hours = parseInt(alarmHourInput.value);
    if (isNaN(hours) || hours < 0 || hours > 23 || alarmHourInput.value.length !== 2) {
      return false;
    }
    return true;
  }

  // Validate minutes
  function validateMinutes() {
    const minutes = parseInt(alarmMinuteInput.value);
    if (isNaN(minutes) || minutes < 0 || minutes > 59 || alarmMinuteInput.value.length !== 2) {
      return false;
    }
    return true;
  }

  return validateHours() && validateMinutes();
}

function clearMessage() {
  setTimeout(() => {
    alarmMessage.textContent = "";
  }, 3000);
}

// Function to set the alarm
function setAlarm() {
  if (validateInputs()) {
    alarmTime = `${alarmHourInput.value}:${alarmMinuteInput.value}`;
    alarmSetDisplay.textContent = alarmTime;
    alarmMessage.textContent = "Alarm set successfully";
    alarmMessage.style.color = "green";
    clearMessage();
  } else {
    alarmMessage.textContent = `Please enter a valid time, eg: 23:59 `;
    alarmMessage.style.color = "red";
    clearMessage();
  }
}

// Event listeners
onEvent("input", alarmHourInput, () => {
  alarmHourInput.value = alarmHourInput.value.replace(/[^0-9]/g, "").slice(0, 2);
});

onEvent("input", alarmMinuteInput, () => {
  alarmMinuteInput.value = alarmMinuteInput.value
    .replace(/[^0-9]/g, "")
    .slice(0, 2);
});

onEvent("click", alarmSetButton, setAlarm);

