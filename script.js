const form = document.getElementById("loginForm");
    const message = document.getElementById("message");

    const validUsername = "admin";
    const validPassword = "1234";
    const maxAttempts = 5;
    const cooldownMinutes = 1;

    // Allowed characters for username: letters, digits, @ and .
    const usernameRegex = /^[a-zA-Z0-9@.]+$/;

    // Get attempts and last attempt time from localStorage
    let attempts = parseInt(localStorage.getItem("attempts")) || 0;
    const lastAttemptTime = parseInt(localStorage.getItem("lastAttemptTime"));

    // Check cooldown expiration
    if (lastAttemptTime) {
      const now = Date.now();
      const elapsedMinutes = (now - lastAttemptTime) / 60000;

      if (elapsedMinutes >= cooldownMinutes) {
        // Reset cooldown
        attempts = 0;
        localStorage.setItem("attempts", "0");
        localStorage.removeItem("lastAttemptTime");
      }
    }

    // If already locked
    if (attempts >= maxAttempts) {
      message.style.color = "red";
      message.textContent = "Account locked due to too many failed attempts. Try again later.";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      // Username validation
      if (!usernameRegex.test(username)) {
        message.style.color = "red";
        message.textContent = "Invalid username. Only letters, numbers, '@' and '.' are allowed.";
        return;
      }

      // If account is still locked
      if (attempts >= maxAttempts) {
        message.style.color = "red";
        message.textContent = "Account locked due to too many failed attempts. Try again later.";
        return;
      }

      if (username === validUsername && password === validPassword) {
        message.style.color = "green";
        message.textContent = "Login successful!";
        localStorage.setItem("attempts", "0");
        localStorage.removeItem("lastAttemptTime");
        window.location.href = "welcome.html"; // Redirect to welcome page
      } else {
        attempts++;
        localStorage.setItem("attempts", attempts);
        localStorage.setItem("lastAttemptTime", Date.now().toString());

        message.style.color = "red";
        if (attempts >= maxAttempts) {
          message.textContent = "Account locked due to too many failed attempts. Try again in 1 minute.";
        } else {
          message.textContent = `Error: Invalid credentials. Attempt ${attempts} of ${maxAttempts}`;
        }
      }
    });