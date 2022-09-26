// console.log('choose a course');
const bootstrap = require("bootstrap");

const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) =>
    new bootstrap.Popover(popoverTriggerEl, {
      trigger: "focus",
    })
);

// import { truncate, stripTags } from '../../helpers/formatText';

// const homeworkBody = document.querySelector('.homework--body');

// homeworkBody.innerText = stripTags(homeworkBody.innerText);

// import axios from 'axios';

// const courses = document.querySelectorAll('.course');
// const enrolledCourses = document.querySelectorAll('.enrolled-course');

// let dashSubheading = document.querySelector('.main__top--sub-heading');
// let dashBody = document.querySelector('.main--content');

// const leaveCourse = async (id) => {
//   const res = await axios({
//     method: 'PATCH',
//     url: `courses/leave/${id}`,
//     data: { id },
//   });

//   // repeated code
//   if (res.data.status === 'success') {
//     console.log('success');
//     window.setTimeout(() => {
//       location.assign('/dashboard');
//     }, 1500);
//   }
// };

// const showCourse = async (id) => {
//   // console.log(id);
//   dashSubheading.textContent = 'Your courses';
//   const res = await axios({
//     method: 'GET',
//     url: `courses/${id}`,
//     data: { id },
//   });
//   const { course } = res.data;

//   dashBody.innerHTML = `
//   <div class="course">
//     <h3 class="course--title">${course.title}</h3>
//     <button class="leave-btn" data-id="${id}">leave</button>
//   </div>
//   `;

//   document.querySelector('.leave-btn').addEventListener('click', (e) => {
//     leaveCourse(id);
//   });
// };

// enrolledCourses.forEach((course) => {
//   course.addEventListener('click', (e) => {
//     // console.log(e.target);
//     showCourse(e.target.dataset.id);
//   });
// });

// courses.forEach((el) => {
//   el.addEventListener('click', (e) => {
//     // console.log(e.target);
//     enroll(e.target.dataset.id);
//   });
// });

// const enroll = async (id) => {
//   try {
//     console.log('sending request');
//     const res = await axios({
//       method: 'PATCH',
//       url: `courses/${id}/enroll`,
//     });

//     if (res.data.status === 'success') {
//       console.log('success');
//       window.setTimeout(() => {
//         location.assign('/dashboard');
//       }, 1500);
//     }
//   } catch (err) {
//     // console.log(err);
//   }
// };
