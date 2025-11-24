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
const currentTimeEl = document.querySelector('#currentTime');

// Post Container where we'll add posts dynamically
const postsContainer = document.querySelector('#postContainer');
const emptyState = document.querySelector('#emptyState');

// Create Post Modal elements
const createPostModal = document.querySelector('#createPostModal');
const createPostForm = document.querySelector ('#createPostForm');
const postContentInput = document.querySelector('#postContent');
const postCategorySelect = document.querySelector('#postCategory');
const closeModalBtn = document.querySelector('#closeModal')
const cancelPostBtn = document.querySelector('#cancelPost');

// Edit Post Modal Elements
const editPostModal = document.querySelector('#editPostModal');
const editPostForm = document.querySelector('#editPostForm');
const editPostContent = document.querySelector("#editPostContent");
const closeEditModelBtn = document.querySelector('#closeEditModal');
const cancelEditBtn = document.querySelector('#cancelEdit');

// Toast Notification Elements
const toast = document.querySelector('#toast');
const toastMessage = document.querySelector('#toastMessage');

// =========================================== 

// Posts array - stores all posts as objects
let posts = [];

// Current Filter State
let currentFilter = 'all';

// Currently Editing Post ID (used for edit functionality)
let currentlyEditingPostId = null;

// User statistics
let userStats = {
   postsCreated: 0,
   totalLikes: 0,
   commentsMade: 0
}

// JSON.stringify() - Converts JavaScript object to JSON String
// JSON.parse() - Converts JSON string back to JavaScript Object
// localStorage.setItem() - Saves Data
// localStorage.getItem() - Retrieves Data

/* 
   * Load Posts from localStorage
   * Demonstrates: localStorage, JSON.parse, error handling with try/catch
*/

function loadPostsFromStorage(){
   try {

      // Get the stored posts string from localStorage
      const storedPosts = localStorage.getItem('socialPosts');

      // If posts exist, parse them from JSON String to JavaScript Array
      if (storedPosts) {
         posts = JSON.parse(storedPosts);
         renderPosts();
         updateStatistics();
      }

      // Load User stats
      const storedStats = localStorage.getItem('userStats');
      if (storedStats){
         userStats = JSON.parse(storedStats);
         updateStatisticsDisplay();
      }
   } catch (error){
      console.error ('Error  Loading Data:', error);
      posts = [];
      userStats = { postsCreated: 0, totalLikes: 0, commentsMade: 0};
   }
}

/**
 * Save posts to localStorage
 * Demonstrates: localStorage, JSON.stringfy
 */

function savePostsToStorage () {
   try {
      // Convert posts array to JSON string and Save
      localStorage.setItem('socialPosts', JSON.stringify(posts));
      localStorage.setItem('userStats', JSON.stringify(userStats));
   } catch (error){
      console.error('Error Saving Data:', error);
   }
}

// Basic Event Listener
/**
 * addEventListener('click', function(){})
 * addEventListener() lets us respond to user interactions First parameter: event type ('click', 'input', 'submit', etc.)
 * Second parameter: function to call when events happens what to do
 * Common Events are:
 *    1. 'click' - when element is clicked
 *    2. 'input' - when input value changes (real-time)
 *    3. 'submit' - when form is submitted
 *    4. 'change' - when select/checkbox changes
 */

/**
 * Create Post Button - Opens the modal
 * Demonstrates: Basic click event listner
 */

createPostBtn.addEventListener('click', function(){
   openCreatePostModal();
});

// Empty state create Button does the same thing
emptyCreateBtn.addEventListener('click', function(){
   openCreatePostModal();
});

/**
 * Close Modal Button
 * Demonstrates: Click event, calling Functions
 */
closeModalBtn.addEventListener('click', function(){
   closeCreatePostModal();
});

/**
 * Cancel Button
 */
cancelPostBtn.addEventListener('click', function(){
   closeCreatePostModal();
});

/**
 * Close Edit Modal
 */
closeEditModelBtn.addEventListener('click', function(){
   closeEditPostModal();
});

cancelEditBtn.addEventListener('click', function(){
   closeEditPostModal();
});

/**
 * Click Outside modal to close
 * Demonstrates: event.target checking
 */

createPostModal.addEventListener('click', function(event) {
   // event.target is the element that was actually clicked
   // If user clicked the overlay (not the modal content), close it
   if (event.target === createPostModal){
      closeCreatePostModal();
   }
});

editPostModal.addEventListener('click', function(event){
   if(event.target === editPostModal){
      closeEditPostModal();
   }
});

/**
 * Form Submit Event
 * Demonstrates: Form handling, preventDefault, accessing form values
 */
createPostForm.addEventListener('submit', function(event){
   /**
    * PREVENTING DEFAULT BEHAVIOUR (INTERMEDIATE)
      preventDefault() stops the form from submitting the traditional way (which would refresh the page). We want to handle it with JavaScript.
    */

   event.preventDefault();

   /**
      ACCESSING FORM VALUES (BEGINNER/INTERMEDIATE)
      .value property gets the current value from form inputs
      .trim() removes unnecessary whitespaces from beginning and end
    */

      const content = postContentInput.value.trim();
      const category = postCategorySelect.value;

      // Only create Post if there is content
      if (content) {
         createPost (content, category);

         /**
          * RESETTING FORM (INTERMEDIATE)
          * CLEAR THE FORM FIELDS AFTER SUBMISSION
          */

         postContentInput.value = '',
         postCategorySelect.value = 'technology';

         // Close the Modal
         closeCreatePostModal();

         // Show Success Notification
         showToast('Post Created Successfully! 🎉');

      }
});

/**
 * Edit Post Form Submit
 */
editPostForm.addEventListener('submit', function(event){
   event.preventDefault();

   const newContent = editPostContent.value.trim();

   if (newContent && currentlyEditingPostId) {
      updatePost (currentlyEditingPostId, newContent);
      closeEditPostModal();
      showToast('Post Updated! ✏️');
   }
});

// Navigation and Filtering

// Demonstrates: forEach loops, classList manipulation, data attributes

/**
 * Navigation Buttons Click Handler
 * Demonstrates: forEach, classList, dataset attributes
 */

navButtons.forEach(function(button){
   button.addEventListener('click', function(){
      /**
         DATASET ATTRIBUTES (ADVANCED)
         data-view = "feed" in HTML becomes dataset.view in JavaScript
         This is the best way to store custom data on elements
       */

      const view = button.dataset.view;

      /**
         CLASS MANIPULATION (INTERMEDIATE)
         Remove 'active' class from all buttons
       */
      navButtons.forEach(btn => btn.classList.remove('active'));

      /*
         CLASS MANIPULATION (INTERMEDIATE)
         Add 'active' class to clicked button
      */
      button.classList.add('active');

      // Handle Different views
      handleViewChange(view);
   });
});

/**
 * Filter buttons click handler
 * Demonstrates: Data attributes, filtering Logic
 */

filterButtons.forEach(function(button){
   button.addEventListener('click', function(){
      // Get the Category from data-category attributes
      const category = button.dataset.category;
      currentFilter = category;

      // Update active buttons styling
      filterButtons.forEach(btn => btn.classList.remove('active'));

      button.classList.add('active');

      // Filter the Posts
      filterPosts(category);
   });
});

/*
   SECTION 6: ACCORDION FUNCTIONALITY (INTERMEDIATE/ADVANCED)

   Demonstrates: DOM  traversal, classList.toggle, finding siblings
*/

/**
 * Accordion Click Handler
 * Demonstrates: forEach, closest, classList.toggle
 */
accordionHeaders.forEach(function(header){
   header.addEventListener('click', function(){
      /*
         DOM TRAVERSAL (INTERMEDIATE)
         closest() finds the nearest ancestor element matching the selector
         This goes UP the DOM tree
      */
      const accordionItem = header.closest('.accordion-item')
      console.log(accordionItem);


      // This closes the Accordion that is open if clicked another accordion
      accordionHeaders.forEach(hdr => {
         const item = hdr.closest('.accordion-item');
         
         if(item !== accordionHeaders){
            item.classList.remove('active');
         }
      });

      /*
      CLASS MANIPULATION (INTERMEDIATE)
      classList.toggle() adds the class if it's not there, remove if it is there. Perfect for accordion
      */
     // this opens and closes the accordion clicked
     accordionItem.classList.toggle('active');
   });
});

/*
   SECTION 7: LIVE CLOCK WITH SETINTERVAL (ADVANCED)

   setInterval() executes a function repeatedly at specified intervals

   clearInterval() stops the Interval

   This creates a live updating clock the shows the current time
*/

/**
 * Update the current time display every second
 * Demonstrates: setInterval, Data Object, textContent
 */
function startLiveClock(){
   // Function to update the time
   function updateTime() {
      // Get Current Date and Time
      const now = new Date();

      // Format the time nicely
      const options = {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit'
      };
      const timeString = now.toLocaleDateString('en-US', options);

      /*
      CHANGING CONTENT (BEGINNER)
      textContent sets the text inside an element
      */
      
      currentTimeEl.textContent = timeString;
   }

   // Update Immediately
   updateTime();

   /*
   SETINTERVAL (ADVANCED)
   Calls updateTime every 1000 milliseconds (1 second)
   This creates the "Live" updating effect
   */
   setInterval(updateTime, 1000);
}

/*
SECTION 8: CREATING POSTS DYNAMICALLY (INTERMEDIATE)

createElement() creates new HTML elements
appendChild() adds elements to the DOM
innerHTML sets HTML content inside an element

This section demonstrates building complex HTML structures with JavaScript
*/

/**
 * Create a new post
 * Demonstrates: Object creation, array manipulation, function calls
 */
function createPost(content, category){
   // Create a post object with all necessary data
   const post = {
      id: Date.now.toString(), // Unique ID using TimeStamp
      content: content,
      category: category,
      author: userName.textContent,
      likes: 0,
      liked: false,
      saved: false,
      comments: [],
      timestamp: Date.now()
   };

   /*
   ARRAY MANIPULATION (INTERMEDIATE)
   unshift() adds item to the beginning of array (so newest posts appear first)
   */
   posts.unshift(post);

   // Update statistics
   userStats.postsCreated++;

   // Save to localStorage
   savePostsToStorage();

   // re-render all Posts
   renderPosts();

   // Update statistics display
   updateStatistics();
}

/**
 * Create a post card element
 * Demonstrates: Extensive createElement, innerHTML, dataset, classList
 */
function createPostElement(post){
   /*
   CREATING ELEMENTS (INTERMEDIATE)
   createElement() creates a new element but doesn't add it to the page yet
   */
   const postCard = document.createElement('div');

   /*
   CLASS MANIPULATION (INTERMEDIATE)
   classList.add() adds one or more classes
   */
   postCard.classList.add('post-card');

   /*
   DATASET ATTRIBUTES (ADVANCED)
   data-* attributes store custom data on elements In HTML: <div data-id="123">
   In JS: element.dataset.id = "123"
   */
   postCard.dataset.id = post.id;
   postCard.dataset.category = post.category;

   // calculate time ago
   const timeAgo = getTimeAgo(post.timestamp);

   /*
   SETTING HTML CONTENT (BEGINNER/INTERMEDIATE)
   innerHTML sets the HTML content inside an element
   We build complex nested HTML structures
   Template literals (backticks) allow multi-line strings
   */
   postCard.innerHTML =`
      <div class="post-header">
         <div class="post-author">
            <span class="author-avatar">👤</span>
            <div class="author-info">
               <div class="author-name">${post.author}</div>
               <div class="post-time">${timeAgo}</div>
            </div>
         </div>
         <span class="post-category">${getCategoryIcon(post.category)} ${post.category}</span>
      </div>

      <div class="post-content">${escapeHtml(post.content)}</div>

      <div class="post-actions">
         <button class="action-btn ${post.liked ? 'liked': ''}" data-action="like">
            <span class="action-btn-icon">❤️</span>
            <span class="action-btn-text">${post.likes} Likes </span>
         </button>

         <button class="action-btn ${post.saved ? 'saved':''}" data-action="save">
            <span class="action-btn-icon">🔖</span>
            <span class="action-btn-text">Save</span>
         </button>

         <button class="action-btn" data-action="edit">
            <span class="action-btn-icon">✏️</span>
            <span class="action-btn-text">Edit</span>
         </button>

         <button class="action-btn" data-action="delete">
            <span class="action-btn-icon"></span>
            <span class="action-btn-text">Delete</span>
         </button>
      </div>

      <div class="comments-section hidden">
         <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required>
            <button type="submit" class="btn-comment">Post</button>
         </form>

         <div class="comments-list>
            ${post.comments.map(comment => `
               <div class="comment-item" data-comment.id = "${comment.id}">
                  <div class="comment-header">
                     <span class="comment-author">${comment.author}</span>
                     <button class="comment-delete" data-comment-id="${comment.id}">🗑️</button>
                  </div>
                  <div class="comment-text">${escapeHtml(comment.text)}</div>
               </div>
            `).join('')}
         </div>
      </div>
   `;

   return postCard;
}

startLiveClock();

