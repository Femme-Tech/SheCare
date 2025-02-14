import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc,
    getDoc,
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
const googleProvider = new GoogleAuthProvider();

/**
 * Send a welcome email via EmailJS.
 * Ensure you have included the EmailJS script in your HTML (see instructions below).
 */
function sendWelcomeEmail(user) {
    // Debug log: Confirm that user.email is available.
    console.log("Sending welcome email to:", user.email);

    const templateParams = {
        to_email: user.email,               // This will be the recipient email in your EmailJS template.
        to_name: user.displayName || "User", // This will be used for personalization in your template.
        message: "Thank you for signing up with SheCare! We're excited to have you join our community."
    };

    emailjs.send("service_6g2fwtq", "template_dj4q0y9", templateParams)
      .then(function(response) {
         console.log("Welcome email sent!", response.status, response.text);
      }, function(error) {
         console.error("Failed to send welcome email:", error);
      });
}

function setupFormToggle() {
    const loginToggle = document.getElementById('loginToggle');
    const signupToggle = document.getElementById('signupToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Default: show signup form
    signupToggle.classList.add('active');
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();

    if (loginToggle && signupToggle) {
        loginToggle.addEventListener('click', () => {
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
            loginForm.style.display = 'flex';
            signupForm.style.display = 'none';
            loginToggle.classList.add('active');
            signupToggle.classList.remove('active');
            // Clear any error messages
            const loginError = document.getElementById('loginError');
            const signupError = document.getElementById('signupError');
            if (loginError) loginError.textContent = '';
            if (signupError) signupError.textContent = '';
        });

        signupToggle.addEventListener('click', () => {
            if (loginForm) loginForm.reset();
            if (signupForm) signupForm.reset();
            loginForm.style.display = 'none';
            signupForm.style.display = 'flex';
            signupToggle.classList.add('active');
            loginToggle.classList.remove('active');
            // Clear any error messages
            const loginError = document.getElementById('loginError');
            const signupError = document.getElementById('signupError');
            if (loginError) loginError.textContent = '';
            if (signupError) signupError.textContent = '';
        });
    }
}

async function handleGoogleSignIn(mode) {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Debug: Log user details to ensure email exists.
        console.log("Google user object:", user);
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (mode === "login") {
            if (!userDocSnap.exists()) {
                // For login: if not registered, abort and show error.
                await signOut(auth);
                throw new Error("This Google account is not registered. Please sign up first.");
            } else {
                // For login: update photo if available.
                await setDoc(userDocRef, {
                    photoURL: user.photoURL || ""
                }, { merge: true });
            }
        } else if (mode === "signup") {
            if (!userDocSnap.exists()) {
                // For signup: create new user document.
                await setDoc(userDocRef, {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL || "",
                    createdAt: serverTimestamp()
                });
                // Send welcome email using EmailJS.
                sendWelcomeEmail(user);
            } else {
                // For signup: if already registered, abort and show error.
                await signOut(auth);
                throw new Error("This Google account is already in use. Please sign in.");
            }
        }
        
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userEmail', user.email);
        window.location.href = 'index.html';
    } catch (error) {
        // Select error element based on mode.
        const errorEl = mode === "login" ? document.getElementById('loginError') : document.getElementById('signupError');
        if (errorEl) {
            errorEl.textContent = error.message || "Google sign-in failed. Please try again.";
            errorEl.style.display = 'block';
        } else {
            alert(error.message || "Google sign-in failed. Please try again.");
        }
    }
}

function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => handleGoogleSignIn("signup"));
    }

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

            // Optionally, send a welcome email for email signups here if desired.
            // sendWelcomeEmail(user);

            // Switch to login view after successful signup.
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
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => handleGoogleSignIn("login"));
    }

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Login Error:", error);
            errorEl.textContent = "Invalid email or password. Please try again.";
        }
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('userEmail');
            window.location.href = "auth.html";
        } catch (error) {
            console.error("Logout Error:", error);
        }
    });
}

function runSheCareAuth() {
    setupFormToggle();
    setupSignupForm();
    setupLoginForm();
    setupLogout();
}

runSheCareAuth();
