"use strict";

/* Anger sticky klass till navigationsmeny vid scroll */
const headerEl = document.querySelector('header');
window.addEventListener('scroll', () => {
    headerEl.classList.toggle('sticky', window.scrollY > 20);
})

/* Javascript för smooth scrolling vid klick av länk */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});