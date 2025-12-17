<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Xperts Mail - Login</title>
    <!-- Google Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
    <!-- SDKs -->
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
    <script src="https://unpkg.com/@supabase/supabase-js@2"></script>

    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            background: white;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            width: 100%;
            max-width: 400px;
        }
        h2 { text-align: center; color: #202124; margin-top: 0; }
        
        .form-group { margin-bottom: 15px; }
        
        label { display: block; margin-bottom: 5px; color: #5f6368; font-size: 14px; }
        
        input, select {
            width: 100%;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 16px;
            transition: 0.2s;
        }
        input:focus, select:focus {
            border-color: #1a73e8;
            outline: none;
            box-shadow: 0 0 0 2px rgba(26,115,232,0.2);
        }

        button {
            width: 100%;
            background-color: #1a73e8;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 4px;
            font-weight: 500;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        button:hover { background-color: #1557b0; }
        button:disabled { background-color: #ccc; cursor: not-allowed; }

        .toggle-text {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #1a73e8;
            cursor: pointer;
        }
        .toggle-text:hover { text-decoration: underline; }
        
        .hidden { display: none; }
        
        /* Spinner */
        .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1a73e8;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            margin: 10px auto;
            display: none;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

<div class="container">
    <!-- Login Form -->
    <div id="login-form">
        <h2>Sign In</h2>
        <div class="form-group"><input type="email" id="login-email" placeholder="Email"></div>
        <div class="form-group"><input type="password" id="login-password" placeholder="Password"></div>
        <button onclick="handleLogin()">Login</button>
        <div class="loader" id="login-loader"></div>
        <p class="toggle-text" onclick="toggleView('signup')">Create account</p>
    </div>

    <!-- Signup Form -->
    <div id="signup-form" class="hidden">
        <h2>Create Account</h2>
        <div class="form-group"><input type="text" id="fname" placeholder="First Name"></div>
        <div class="form-group"><input type="text" id="lname" placeholder="Last Name"></div>
        
        <div class="form-group">
            <label>Profile Picture</label>
            <input type="file" id="profile-pic" accept="image/*">
        </div>
        
        <div class="form-group"><input type="text" id="dob" placeholder="Date of Birth (DD/MM/YYYY)"></div>
        
        <div class="form-group">
            <select id="gender">
                <option value="" disabled selected>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
            </select>
        </div>
        
        <div class="form-group"><input type="email" id="signup-email" placeholder="Email"></div>
        <div class="form-group"><input type="password" id="signup-password" placeholder="Password"></div>
        
        <button onclick="handleSignup()" id="btn-signup">Sign Up</button>
        <div class="loader" id="signup-loader"></div>
        <p class="toggle-text" onclick="toggleView('login')">Already have an account? Sign in</p>
    </div>
</div>

<script>
    // --- 1. CONFIGURATION ---
    
    // Firebase Config (User Data)
    const firebaseConfigUser = {
        apiKey: "AIzaSyDL7sPp-FkG59L-mRQ7BrCGgeKMhQC80iw",
        authDomain: "xperts-metadata.firebaseapp.com",
        projectId: "xperts-metadata",
        storageBucket: "xperts-metadata.firebasestorage.app",
        messagingSenderId: "514845910910",
        appId: "1:514845910910:web:5a2402130a97b5d749b52f",
        measurementId: "G-CQ5KWGJSZB"
    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfigUser);
    const db = firebase.firestore();

    // Supabase Config
    const sbUrl = 'https://bbuqlrtjkhsddxshwmxk.supabase.co';
    const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidXFscnRqa2hzZGR4c2h3bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTQ1ODMsImV4cCI6MjA3OTc5MDU4M30.e-bZCRs7aEauXy3arrqgVz0zV2N26jU25Jv0plXq23c';
    const supabase = window.supabase.createClient(sbUrl, sbKey);

    // --- 2. LOGIC ---

    function toggleView(view) {
        document.getElementById('login-form').classList.toggle('hidden', view === 'signup');
        document.getElementById('signup-form').classList.toggle('hidden', view === 'login');
    }

    function generateEncKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 25; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async function handleSignup() {
        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const dob = document.getElementById('dob').value;
        const gender = document.getElementById('gender').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const fileInput = document.getElementById('profile-pic');
        const loader = document.getElementById('signup-loader');
        const btn = document.getElementById('btn-signup');

        if (!email || !password || !fname) {
            alert("Please fill required fields (Name, Email, Password)");
            return;
        }

        btn.disabled = true;
        loader.style.display = 'block';

        try {
            // Check if user exists
            const snapshot = await db.collection("users").where("email", "==", email).get();
            if (!snapshot.empty) {
                alert("Email already registered!");
                throw new Error("User exists");
            }

            let photoURL = "https://ui-avatars.com/api/?name=" + fname + "+" + lname;

            // Upload Profile Pic to Supabase
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const fileName = `profile_${Date.now()}_${file.name.replace(/\s/g, '')}`;
                const { data, error } = await supabase.storage.from('profile-pics').upload(fileName, file);
                
                if (error) {
                    console.error("Supabase Error:", error);
                    alert("Image upload failed, utilizing default avatar.");
                } else {
                    const { data: urlData } = supabase.storage.from('profile-pics').getPublicUrl(fileName);
                    photoURL = urlData.publicUrl;
                }
            }

            const encKey = generateEncKey();

            // Store in Firestore
            await db.collection("users").add({
                firstName: fname,
                lastName: lname,
                email: email,
                password: password, // Note: Storing plain text as requested by prompt logic
                dob: dob,
                gender: gender,
                photoURL: photoURL,
                encKey: encKey,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // Auto Login
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userKey", encKey);
            window.location.href = "2.html";

        } catch (e) {
            console.error(e);
            if(e.message !== "User exists") alert("Error creating account");
        } finally {
            btn.disabled = false;
            loader.style.display = 'none';
        }
    }

    async function handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const loader = document.getElementById('login-loader');

        loader.style.display = 'block';

        try {
            const snapshot = await db.collection("users")
                .where("email", "==", email)
                .where("password", "==", password)
                .get();

            if (snapshot.empty) {
                alert("Invalid Email or Password");
            } else {
                const userData = snapshot.docs[0].data();
                localStorage.setItem("userEmail", userData.email);
                localStorage.setItem("userKey", userData.encKey);
                window.location.href = "2.html";
            }
        } catch (e) {
            console.error(e);
            alert("Login failed due to network error");
        } finally {
            loader.style.display = 'none';
        }
    }
</script>
</body>
</html>
