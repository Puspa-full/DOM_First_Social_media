/* 
   Section: 1: ELEMENT SELECTION (BEGINNER)
*/

// ==== Header Elements ===

const userName = document.querySelector("#userName");
const createPostBtn = document.querySelector("#createPostBtn");
const emptyCreateBtn = document.querySelector("#emptyCreateBtn");

// Navigation Buttons - querySelectorAll returns a NodeList (arrry-like)
const navButtons = document.querySelectorAll('.nav-btn');

// Statistics Elements
const totalPostsE1 = document.querySelector('#totalPosts');
const totalLikesE1 = document.querySelector('#totalLikes');
const totalCommentsE1 = document.querySelector('#totalComments');

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');

// Accordion Items
const accordionHeaders = document.querySelectorAll('.accordion-header');

// Time display elemetn (will update with setInterval)
const currentTimeE1 = document.querySelector('#currentTime');

// Post Container where we'll add posts dynamically
const postsContainer = document.querySelector('#postContainer');
const emptyState = document.querySelector('#emptyState');

// Create Post Modal elements
