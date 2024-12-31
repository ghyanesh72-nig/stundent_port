// Page navigation and validation
let currentPage = 1;
const totalPages = 4;

// Function to show the current page
function showPage(pageNumber) {
    const allPages = document.querySelectorAll(".form-page");
    allPages.forEach(page => {
        page.style.display = "none"; // Hide all pages
    });
    const currentPageElement = document.getElementById(`page-${pageNumber}`);
    if (currentPageElement) {
        currentPageElement.style.display = "block"; // Show the current page
    }

    // Show "Previous" button if not the first page
    document.getElementById('prevButton').style.display = pageNumber > 1 ? 'inline-block' : 'none';

    // Show "Next" button if not the last page, else show "Submit" button
    document.getElementById('nextButton').style.display = pageNumber < totalPages ? 'inline-block' : 'none';
    document.getElementById('submitButton').style.display = pageNumber === totalPages ? 'inline-block' : 'none';
}

// Handle "Next" button click
document.getElementById('nextButton').addEventListener('click', nextPage);

// Handle "Previous" button click
document.getElementById('prevButton').addEventListener('click', prevPage);

// Handle form submission (if necessary)
document.getElementById("studentForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    submitForm();
});

// Function to move to the next page
function nextPage() {
    // Find the current page form
    const currentForm = document.getElementById(`page-${currentPage}`);
    const formElements = currentForm.querySelectorAll("input, select, textarea");

    // Check for validity of the form on the current page
    let isValid = true;
    formElements.forEach(element => {
        if (!element.checkValidity()) {
            isValid = false;
            element.classList.add("border-red-500"); // Visual cue for invalid fields
        } else {
            element.classList.remove("border-red-500");
        }
    });

    if (isValid) {
        currentPage++;
        showPage(currentPage);
    } else {
        alert("Please complete all required fields before proceeding.");
    }
}

// Function to move to the previous page
function prevPage() {
    currentPage--;
    showPage(currentPage);
}

// Function to submit the form
function submitForm() {
    const formData = {
        firstName: document.getElementById("firstname").value.trim(),
        lastName: document.getElementById("lastname").value.trim(),
        usn: document.getElementById("usn").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        email: document.getElementById("email").value.trim(),
        degreeStream: document.getElementById("degreeStream").value.trim(),
        hobbies: document.getElementById("hobbies").value.trim(),
        interestTechnical: document.getElementById("interestTechnical").value.trim(),
        interestExtracurricular: document.getElementById("interestExtracurricular").value.trim(),
        interestSports: document.getElementById("interestSports").value.trim(),
        certifications: document.getElementById("certifications").value.trim(),
        internships: document.getElementById("internships").value.trim(),
        learnSkill: document.getElementById("learnSkill").value.trim(),
        miniProject: document.getElementById("miniProject").value.trim(),
        majorProject: document.getElementById("majorProject").value.trim(),
        researchPapers: document.getElementById("researchPapers").value.trim(),
        achievements: document.getElementById("achievements").value.trim(),
        managementPgcet: document.getElementById("managementPgcet").value.trim(),
        sslc: document.getElementById("sslc").value.trim(),
        puc: document.getElementById("12thPuc").value.trim() // Update this field to match the correct ID
    };

    fetch('http://localhost:5000/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Form submitted successfully!');
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error submitting form.');
    });
}

// Initialize the form to show the first page
showPage(currentPage);
