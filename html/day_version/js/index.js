const textArray = []; // Initialize an empty array

// Function to fetch text from a file
async function fetchTextFromFile() {
    try {
        const response = await fetch('text/index.txt'); // Replace 'text.txt' with the actual path to your text file
        const text = await response.text();
        // Split the text into an array using line breaks as separators
        textArray.push(...text.split('\n').map(line => line.trim()));
    } catch (error) {
        console.error('Error fetching text:', error);
    }
}

// Call the function to fetch text from the file
fetchTextFromFile().then(() => {
    const textContainer = document.getElementById("text-container");
    let currentIndex = 0;

    function changeLanguage() {
        textContainer.textContent = textArray[currentIndex];
        currentIndex = (currentIndex + 1) % textArray.length;
    }

    setInterval(changeLanguage, 2000); // Change text every 1.5 seconds
});

// js/index.js

function openNav() {
  document.getElementById("MYSIDE").style.width = "250px";
}

function closeNav() {
  document.getElementById("MYSIDE").style.width = "0";
}
