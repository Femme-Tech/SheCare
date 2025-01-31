// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBM14aLNNFjiMPY1Fa-wsP1LydYzpEB2Jc",
    authDomain: "shecare-f2707.firebaseapp.com",
    projectId: "shecare-f2707",
    storageBucket: "shecare-f2707.appspot.com", 
    messagingSenderId: "594871576314",
    appId: "1:594871576314:web:5a102e6e8d26b9c119cb43",
    measurementId: "G-7PJV0642PB"
  };



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Function to submit a question
async function submitQuestion() {
    const question = document.getElementById("questionInput").value;
    if (question.trim() === "") {
        alert("Please enter a question!");
        return;
    }

    try {
        await addDoc(collection(db, "questions"), { text: question, timestamp: new Date() });
        alert("Question submitted!");
        document.getElementById("questionInput").value = ""; // Clear input
        loadQuestions(); // Reload questions
    } catch (error) {
        console.error("Error adding question:", error);
    }
}

// Function to load and display questions
async function loadQuestions() {
    const questionList = document.getElementById("questionList");
    
    // Check if the element exists before trying to modify it
    if (!questionList) {
        console.error("questionList element not found!");
        return; // Exit the function early if the element doesn't exist
    }

    questionList.innerHTML = ""; // Clear previous list
    const querySnapshot = await getDocs(collection(db, "questions"));

    querySnapshot.forEach(doc => {
        let li = document.createElement("li");
        li.textContent = doc.data().text;
        questionList.appendChild(li);
    });
}

// Attach functions to window (Fixes "submitQuestion is not defined" error)
window.submitQuestion = submitQuestion;
window.loadQuestions = loadQuestions;

// Load questions on page load
document.addEventListener("DOMContentLoaded", loadQuestions);
