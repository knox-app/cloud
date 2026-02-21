// knox-sdk.js
const KnoxAuth = {
    init: function(apiKey) {
        this.key = apiKey;
        console.log("Knox SDK Initialized");
    },
    login: function() {
        // Redirect user to the auth provider page
        window.location.href = `https://your-domain.com/2.html?key=${this.key}`;
    }
};

// Usage on dev site:
// <script src="knox-sdk.js"></script>
// <button onclick="KnoxAuth.login()">Login</button>
