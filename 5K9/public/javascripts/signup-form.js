const form = document.getElementById("signup-form");
const errorBanner = document.getElementById("error-banner");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const dogNameInput = document.getElementById("dogName");
const cyberneticInput = document.getElementById("cybernetic");
const submitButton = document.getElementById("submit");
const loaderAnimation = document.getElementById("loader-animation");

function setErrorBanner(errorMessage) {
  errorBanner.textContent = errorMessage;
  errorBanner.removeAttribute("hidden");
  errorBanner.classList.add("error-banner");
}

function setLoaderAnimation() {
  loaderAnimation.removeAttribute("hidden");
}

function unsetLoaderAnimation() {
  loaderAnimation.setAttribute("hidden", true);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.setAttribute("disabled", "disabled");

  // Fetch form field data
  try {
    setLoaderAnimation();
    const response = await fetch(form.getAttribute("action"), {
      method: form.getAttribute("method"),
      body: JSON.stringify({
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        email: emailInput.value,
        dogName: dogNameInput.value,
        cybernetic: cyberneticInput.checked ? cyberneticInput.value : "",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const { confirmation_route } = await response.json();
      window.location.replace(confirmation_route);
    } else {
      unsetLoaderAnimation();
      const data = await response.json();
      setErrorBanner(data.error);
    }
  } catch (error) {
    unsetLoaderAnimation();
    setErrorBanner("We encountered an error and could not process the form.");
  } finally {
    submitButton.removeAttribute("disabled");
  }
});
