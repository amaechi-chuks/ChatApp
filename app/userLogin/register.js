const baseUrl = 'http://localhost:3000';
const signupForm = document.querySelector('#signup-form');
const loginForm = document.querySelector('#login-form');


/**
 * Assigns an event-listener to signupForm if it exists in the window
 *
 * @param {object} e - The event parameter
 */
const authSignUp = () => {
    console.log(window.localStorage, 'local')
  if (window.localStorage) {
    window.location.replace('rooms');
  } else {
    window.location.replace('login');
  }
};
const authLogin = () => {
  if (window.localStorage.admin === 'true') {
    window.location.replace('admin-profile.html');
  } else {
    window.location.replace('user-profile.html');
  }
};

/**
 * Assigns an event-listener to signupForm if it exists in the window
 *
 * @param {object} e - The event parameter
 */
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userame = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const inputValue = {
      username, email, password, 
    };
    fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(inputValue),
    }).then(res => res.json())
      .then((data) => {
        if (data.status === 201) {
          window.localStorage.token = data.data[0].token;
          window.localStorage.user = data.data[0].user.id;
          const { user } = data.data[0];
          document.querySelector('#signup-form')
            .innerHTML = `<h2>Signup successful<h2/>
          <h3>Welcome<h3/> <p>${user.username}<p/>`;
          setTimeout(() => {
            authSignUp();
          }, 5000);
        } else {
          let output = '<h3>Error<h3/>';
          Object.keys(data).forEach((key) => {
            output += `<p>${data[key]}<p/>`;
          });
          document.querySelector('#signup-form')
            .innerHTML = output;
          setTimeout(() => {
            window.location.replace('signup.html');
          }, 5000);
        }
      }).catch((error) => {
        document.querySelector('#error')
          .innerHTML = `<h2>server error<h2/>
          <h3>${error}<h3/>`;
        setTimeout(() => {
          window.location.replace('signup.html');
        }, 5000);
      });
  });
}