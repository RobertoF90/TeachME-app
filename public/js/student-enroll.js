console.log('choose a course');

import axios from 'axios';

const courses = document.querySelectorAll('.courses');

courses.forEach((el) => {
  el.addEventListener('click', (e) => {
    console.log('e.target');
  });
});
