// auth.js — include this in every protected page

function checkAuth() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}

// Run immediately when script loads
checkAuth();
