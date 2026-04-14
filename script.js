console.log("JS LOADED");
// LOGIN
document.getElementById("login-form-element")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.userId) {
            localStorage.setItem("userId", data.userId);
            alert("Login successful");
            window.location.href = "landingpage.html";
        } else {
            alert("Invalid email or password");
        }

    } catch (err) {
        alert("Server error");
        console.log(err);
    }
});
// SIGNUP
document.getElementById("signup-form-element")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    alert("Signup button clicked");

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
        const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await res.text();
        alert(result);

    } catch (err) {
        alert("Error connecting to server");
        console.log(err);
    }
});
async function testSave() {
    console.log("STEP 1: function started");

    const userId = localStorage.getItem("userId");
    console.log("STEP 2: userId =", userId);

    try {
        const res = await fetch("http://localhost:5000/add-study", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                topic: "Test Topic",
                duration: 1
            })
        });

        console.log("STEP 3: fetch done", res);

    } catch (err) {
        console.log("STEP ERROR:", err);
    }
}
