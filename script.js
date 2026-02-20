let clickCount = 0;
let colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
let colorIndex = 0;
let greetings = ['Hello', 'Hi', 'Hey', 'Greetings', 'Welcome'];
let greetingIndex = 0;

// Get references to elements
const input = document.getElementById('nameInput');
const button = document.getElementById('greetButton');
const output = document.getElementById('output');

// Function to generate a random color
function getRandomColor() {
    // Generate random values for red, green, blue (0-255)
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    
    // Return as RGB color string
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

// Listen for button click
button.addEventListener('click', function() {
    // Get the value from the input
    let name = input.value;
    clickCount = clickCount + 1;
    console.log("Button clicked " + clickCount + " times");
    
    // Update the output paragraph
    if (name === "") {
        output.textContent = "Please enter your name!";
    } else {
        output.textContent = greetings[greetingIndex] + ", " + name + "!";
        greetingIndex = greetingIndex + 1;
        if (greetingIndex >= greetings.length) {
            greetingIndex = 0;
    }}
    
    // Change background to cycling color
    document.body.style.backgroundColor = colors[colorIndex];
    colorIndex = colorIndex + 1;
    
    // Reset to first color when we reach the end
    if (colorIndex >= colors.length) {
        colorIndex = 0;
    }
    
    // Change text color randomly
    output.style.color = getRandomColor();
});

// Print all colors to console (runs once when page loads)
for (let i = 0; i < colors.length; i++) {
    console.log("Color " + i + ": " + colors[i]);
}