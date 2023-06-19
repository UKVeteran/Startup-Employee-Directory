// Variables
const body = document.querySelector('body');
const gallery = document.getElementById('gallery');
const searchContainer = document.querySelector('.search-container');
let employees;

// Create the modal container
const modalContainer = document.createElement('div');
modalContainer.className = 'modal-container';

// Create loading container
const loadingContainer = document.createElement('div');
loadingContainer.className = 'loading-container';

// Fetch data from Random User Generator
fetch('https://randomuser.me/api/?results=12&nat=us,au,ca,gb,nz')
    .then(checkStatus)
    .then(data => displayEmployees(data.results))
    .catch(error => console.log(error));

// Check the status of the response
function checkStatus(response) {
    if (response.ok) {
        hideLoading();
        return response.json();
    } else {
        return Promise.reject(`There was an error: ${response.status} ${response.statusText}`);
    }
}

// Show loading
function showLoading() {
    const markup = `
        <h3>Loading Employees...</h3>
        <img src="images/loading.gif" alt="loading">
    `;
    loadingContainer.innerHTML = markup;
    gallery.appendChild(loadingContainer);
}

// Hide loading
function hideLoading() {
    gallery.removeChild(loadingContainer);
}

// Display the employees on the page
function displayEmployees(data) {

    // Add the data to the employees variable
    employees = data;

    // Iterate over the data
    data.forEach(employee => {

        // Create a new card
        const card = document.createElement('div');
        card.className = 'card';

        // Create markup to go inside the card
        const markup = `
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        `;
        card.innerHTML = markup;

        // Append the card to the gallery
        gallery.appendChild(card);
    });
}

// Convert birthdate
function convertBirthday(date) {
    const year = date.slice(2, 4);
    const month = date.slice(5, 7);
    const day = date.slice(8, 10);
    return `${month}/${day}/${year}`;
}

// Show modal
function showModal(card) {

    // Find the employee in the data with the email from the selected employee
    const email = card.lastElementChild.firstElementChild.nextElementSibling.textContent;
    const employee = employees.find(employee => employee.email === email);

    // Create the markup to go inside the modal container
    const markup = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employee.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="modal-text">${employee.email}</p>
                <p class="modal-text cap">${employee.location.city}</p>
                <hr>
                <p class="modal-text">${employee.phone}</p>
                <p class="modal-text">${employee.location.street}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                <p class="modal-text">Birthday: ${convertBirthday(employee.dob.date)}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn" aria-label="Previous"><i class="fa fa-chevron-left" aria-hidden="true"></i></button>
            <button type="button" id="modal-next" class="modal-next btn" aria-label="Next"><i class="fa fa-chevron-right" aria-hidden="true"></i></button>
        </div>
    `;
    modalContainer.innerHTML = markup;

    // Append the modal container to the body
    body.appendChild(modalContainer);
}

// Close the modal
function closeModal() {
    body.removeChild(modalContainer);
}

// Add a search form
function addSearch() {

    // Add the markup to the search container
    const markup = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#xf002;" id="search-submit" class="search-submit">
        </form>
    `;
    searchContainer.innerHTML = markup;
}

// Search employees on the page
function search(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get the search value
    const searchValue = event.target.firstElementChild.value.toLowerCase();

    // Filter out the cards with the matching search value
    const employeeList = Array.from(document.querySelectorAll('.card'));
    const filtered = employeeList.filter(card => card.lastElementChild.firstElementChild.textContent.includes(searchValue));

    // Remove all of the cards from the page
    employeeList.forEach(card => gallery.removeChild(card));
    
    // If a match is found, show the filtered cards
    if (filtered.length > 0) {
        filtered.forEach(card => gallery.appendChild(card));

    // If no match is found, then show a message
    } else {

        // Create message
        const msg = document.createElement('h3');
        msg.textContent = 'Sorry, no employees were found.';

        // Get the current message from the page
        const currentMsg = document.querySelector('#gallery h3');

        // If a current message exists, first remove it and then add the message
        if (currentMsg) {
            gallery.removeChild(currentMsg);
            gallery.appendChild(msg);

        // Otherwise add the message
        } else {
            gallery.appendChild(msg);
        }
    }

    // Clear the search value from the form
    event.target.firstElementChild.value = '';
}

// Toggle between the previous and next employee
function toggleEmployee(event) {

    const target = event.target;

    // Get all of the employees from the page
    const employeeList = Array.from(document.querySelectorAll('.card'));

    // Get the current modal
    let modal;
    if (target.id === 'modal-prev' || target.id === 'modal-next') {
        modal = target.parentElement.previousElementSibling;
    } else if (target.className === 'fa fa-chevron-left' || target.className === 'fa fa-chevron-right') {
        modal = target.parentElement.parentElement.previousElementSibling;
    }
   
    // Get the name from the modal
    const name = modal.lastElementChild.firstElementChild.nextElementSibling.textContent;

    // Hide the current modal
    modal.style.display = 'none';

    // Get the current employee card
    const currentEmployee = employeeList.filter(card => card.lastElementChild.firstElementChild.textContent === name);
    
    // Get the adjacent employee card
    let adjEmployee;
    let index;
    if (target.className === 'fa fa-chevron-left' || target.id === 'modal-prev') {
        adjEmployee = currentEmployee[0].previousElementSibling;
        index = employeeList.length - 1;
    } else if (target.className === 'fa fa-chevron-right' || target.id === 'modal-next') {
        adjEmployee = currentEmployee[0].nextElementSibling;
        index = 0;
    }

    // Show the modal for the adjacent employee
    if (adjEmployee) {
        showModal(adjEmployee);
    } else {
        showModal(employeeList[index]);
    }
}

// When an employee card is clicked
gallery.addEventListener('click', function(event) {
    if (event.target.className !== 'gallery') {
        showModal(event.target.closest('.card'));
    }
});

// When the modal close button or overlay is clicked
body.addEventListener('click', function(event) {
    const target = event.target;
    if (target.className === 'fa fa-times' || target.className === 'modal-close-btn' || target.className === 'modal-container') {
        closeModal();
    }
});

// When the previous or next button is clicked
body.addEventListener('click', function(event) {
    const target = event.target;
    if (target.className === 'fa fa-chevron-right' || target.className === 'fa fa-chevron-left' || target.id === 'modal-prev' || target.id === 'modal-next') {
        toggleEmployee(event);
    }
});

// When the search form is submitted
searchContainer.addEventListener('submit', function(event) {
    search(event);
});

// Show the loading image
showLoading();

// Add the search form to the page
addSearch();