document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const noticeModal = document.getElementById('noticeModal');
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const proceedButton = document.getElementById('proceedButton');
    const modalProceedButton = noticeModal.querySelector('#modalProceedButton'); // Get the proceed button inside the modal

    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const password = document.getElementById('password').value;

      if (password === '') {
      // Set session variable and redirect to DemoAccess.html
      sessionStorage.setItem('loggedIn', 'true');
      sessionStorage.setItem('demouser', 'true'); // Set demouser to true
      
      // Set expiration time to 5 minutes
      const expirationTime = new Date().getTime() + (500 * 60 * 1000); // 5 minutes in milliseconds
     sessionStorage.setItem('expirationTime', expirationTime);
      
      // Redirect to DemoAccess.html
      window.location.href = 'DemoAccess.html'; 
      return; // Skip the API request
    }
      
      // Make an API request to validate the key
      fetch('https://back-game-3.onrender.com/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: password,
          }),
        })
        .then(response => {
          if (!response.ok) {
            // Handle non-OK responses gracefully
            return response.json().then(errorResponse => {
              throw new Error(errorResponse.error);
            });
          }
          return response.json();
        })
        .then(data => {
          console.log('API Response:', data);

          if (data.valid) {
            // Key is valid
            if (data.expired) {
              alertWithLink('Key has expired. Please purchase a new key.');
            } else {
              const expirationTime = new Date(data.expirationTime).getTime();
              // Store login status and expiration time in session storage
              sessionStorage.setItem('loggedIn', 'true');
              sessionStorage.setItem('demouser', 'false'); // Set demouser to true
              sessionStorage.setItem('expirationTime', expirationTime);
              // Show notice modal
              noticeModal.style.display = 'block';
            }
          } else {
            // Show an alert for invalid key
            alertWithLink('Invalid Key. Please try again.');
          }
        })
        .catch(error => {
          console.error('Error occurred during key validation:', error.message);
          // Show an alert for generic error
          alertWithLink('An error occurred. Please try again later.');
        });
    });

    function alertWithLink(message) {
      const alertMessage = message + ' Invalid, please buy from <a href="https://www.instagram.com//">Instagram</a>.';
      const tempElement = document.createElement('div');
      tempElement.innerHTML = alertMessage;
      alert(tempElement.textContent || tempElement.innerText);
      setTimeout(function () {
        window.location.href = 'https://www.instagram.com/';
      }, 5000); // Redirect to Instagram after 5 seconds
    }

    // Close the modal when the close button is clicked
    noticeModal.querySelector('.close').addEventListener('click', function () {
      noticeModal.style.display = 'none';
    });

    // Proceed button functionality
    proceedButton.addEventListener('click', function () {
      if (agreeCheckbox.checked) {
        // Redirect to the second page
        window.location.href = 'login.html';
      } else {
        alert('Please agree to the terms and conditions to proceed.');
      }
    });

    // Proceed button functionality inside the modal
    modalProceedButton.addEventListener('click', function () {
      // Close the modal
      noticeModal.style.display = 'none';
      // Redirect to DemoAccess.html
      window.location.href = 'DemoAccess.html';
    });
  });