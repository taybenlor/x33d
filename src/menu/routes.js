import { loadMachine } from "./machine";
import { playSound } from "../helpers";

export function handleRouting() {
  // Unhide the header elements
  const headerElements = document.querySelectorAll('header [hidden]');
  for (const element of headerElements) {
    element.removeAttribute('hidden');
  }

  // Hide all the main elements
  const mainElements = document.querySelectorAll('main');
  for (const element of mainElements) {
    element.setAttribute('hidden', '');
  }

  // Show the appropriate main element
  const route = window.location.hash;
  if (route === '#machine') {
    playSound('button');
    const machineMain = document.getElementById('screen-machine');
    machineMain.removeAttribute('hidden');
    loadMachine();
  } else if (route === '#gallery') {
    const galleryMain = document.getElementById('screen-gallery');
    galleryMain.removeAttribute('hidden');
  } else if (route === '#reset') {
    window.localStorage.clear();
    window.location.hash = '';
    window.location.reload();
  } else if (route === '#help') {
    const helpMain = document.getElementById('screen-help');
    helpMain.removeAttribute('hidden');
  }

  // Deselect any selected elements
  const deselectedElements = document.querySelectorAll('a.selected');
  for (const element of deselectedElements) {
    element.classList.remove('selected');
  }

  // Select any elements that match the route
  const selectedElements = document.querySelectorAll(`a[href="${route}"]`);
  for (const element of selectedElements) {
    element.classList.add('selected');
  }
}