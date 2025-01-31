import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc,
    setDoc,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyBM14aLNNFjiMPY1Fa-wsP1LydYzpEB2Jc",
    authDomain: "shecare-f2707.firebaseapp.com",
    projectId: "shecare-f2707",
    storageBucket: "shecare-f2707.appspot.com",
    messagingSenderId: "594871576314",
    appId: "1:594871576314:web:5a102e6e8d26b9c119cb43"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function setupFormToggle() {
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    signupToggle.classList.add('active');
    loginForm.style.display = 'none';

    if (loginToggle && signupToggle) {
        loginToggle.addEventListener('click', () => {
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
        });

        signupToggle.addEventListener('click', () => {
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
        });
    }
}

function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const errorEl = document.getElementById('signupError');

        if (password !== confirmPassword) {
            errorEl.textContent = "Passwords do not match";
            return;
        }

        if (password.length < 6) {
            errorEl.textContent = "Password must be at least 6 characters";
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
                createdAt: serverTimestamp()
            });

            // Redirect to login after successful signup
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
        } catch (error) {
            console.error("Signup Error:", error);
            errorEl.textContent = error.message || "Signup failed. Please try again.";
        }
    });
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Login Error:", error);
            errorEl.textContent = "Invalid email or password. Please try again.";
        }
    });
}

function runSheCareAuth() {
    setupFormToggle();
    setupSignupForm();
    setupLoginForm();
}

runSheCareAuth();