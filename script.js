'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++) btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

///////////// Implementing Smooth Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
/////////// Page Navigation

document.querySelector('.nav__links').addEventListener('click', function (e) {
    // console.log(e.target);
    e.preventDefault();

    // Matching strategy - we want to ignore clicks outside the links
    if (e.target.classList.contains('nav__link')) {
        const id = e.target.getAttribute('href');
        // console.log(id);
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

///////////////////////////////////////
///////////// Tablet Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    // Active tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

///////////////////////////////////////
///////////// Menu Fade animation

const nav = document.querySelector('.nav'); // Selecting and Store the element

const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

///////////// Passing "argument into handler"
// Attach the eventListener to the .nav / mouseover does bubbling
nav.addEventListener('mouseover', handleHover.bind(0.5));
// mouseout is to undo the changes did by nmouseover
nav.addEventListener('mouseout', handleHover.bind(1));

///////////// Sticky navigation: Intersection Observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries) {
    const [entry] = entries;
    // console.log(entry);

    // If intersecting is false, do this.
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null, // interested in the entire viewport
    threshold: 0, // when 0% of the header is visible we want something to happen
    rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

///////////// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target); // For increase performance
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15 // Section will be revealed when it is 15% visible
});
allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden'); //######## DONT FORGET TO REMOVE!
});

///////////// Lazy Loading Images - Very Very good for performance
// To select all the images with data-src properties.
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img'); // will remove blur only after good image is uploaded

        observer.unobserve(entry.target);
    });
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px' // load the images 200px before we reach the images
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////// Slider in Testimonials section
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlide = slides.length;

const goToSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
};
goToSlide(0);

// Next slide
btnRight.addEventListener('click', function () {
    if (curSlide === maxSlide - 1) {
        curSlide = 0;
    } else {
        curSlide++;
    }

    goToSlide(curSlide);
});

// Previous slide
btnLeft.addEventListener('click', function () {
    if (curSlide === 0) {
        curSlide = maxSlide - 1;
    } else {
        curSlide--;
    }

    goToSlide(curSlide);
});
