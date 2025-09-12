// Test if basic JavaScript is working
console.log("Testing basic JavaScript...");

// Test if DOM elements can be accessed
if (typeof document !== 'undefined') {
    console.log("Document object is available");
    
    // Test creating a simple element
    const testDiv = document.createElement('div');
    testDiv.textContent = "JavaScript is working!";
    document.body.appendChild(testDiv);
    
    console.log("DOM manipulation test passed");
} else {
    console.log("Document object is not available (running in Node.js)");
}

// Test basic functions
function testFunction() {
    return "Function test passed";
}
console.log(testFunction());
