import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './script.js';

console.log(db); // Debugging: Check if db is initialized correctly

document.getElementById('questionForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let question = document.getElementById('question').value;

    try {
        // Add to Firestore using v9 syntax
        await addDoc(collection(db, "questions"), {
            name: name,
            email: email,
            question: question,
            timestamp: serverTimestamp()  // Use imported serverTimestamp
        });
        
        document.getElementById('success-message').style.display = 'block';
        document.getElementById('questionForm').reset(); // Clear form fields
    } catch (error) {
        console.error("Error adding document: ", error);
    }
});
