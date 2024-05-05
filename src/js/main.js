"use strict";

const headerEl = document.querySelector('header');

window.addEventListener('scroll', () => {
    headerEl.classList.toggle('sticky', window.scrollY > 20);
})