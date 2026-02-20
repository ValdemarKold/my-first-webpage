// Get references to elements
const input = document.getElementById('nameInput');
const button = document.getElementById('greetButton');
const output = document.getElementById('output');

// Listen for button click
button.addEventListener('click', function() {
    // Get the value from the input
    let name = input.value;
    
    // Update the output paragraph
    if (name === "") {
        output.textContent = "Please enter your name!";
    } else {
        output.textContent = "Hello, " + name + "!";
    }
});