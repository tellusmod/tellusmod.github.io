// ===== Elements =====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");
const updatesDiv = document.getElementById("updates");

let currentUser = null;
let isAdmin = false;
let updatesCache = [];

// ===== Login =====
loginBtn.onclick = async () => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  } catch (err) {
    console.error("Login error:", err);
    alert("Login failed. Check console.");
  }
};

// ===== Logout =====
logoutBtn.onclick = () => auth.signOut();

// ===== Render posts =====
function renderUpdates() {
  updatesDiv.innerHTML = "";

  updatesCache.forEach(({ id, data }) => {
    updatesDiv.innerHTML += `
      <div class="post">
        <div>${escapeHtml(data.text)}</div>
        ${
          isAdmin
            ? `<button class="deleteBtn" onclick="deletePost('${id}')">Delete</button>`
            : ""
        }
      </div>
    `;
  });
}

// ===== Auth state =====
auth.onAuthStateChanged(user => {
  currentUser = user;
  isAdmin = user && user.email === ADMIN_EMAIL;

  console.log("Logged in as:", user?.email);
  console.log("Is admin:", isAdmin);

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    adminPanel.style.display = isAdmin ? "block" : "none";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    adminPanel.style.display = "none";
  }

  renderUpdates(); // 🔥 re-render when auth changes
});

// ===== Post update =====
async function postUpdate() {
  if (!isAdmin) {
    alert("Not authorized");
    return;
  }

  const textBox = document.getElementById("postText");
  const text = textBox.value.trim();
  if (!text) return;

  try {
    await db.collection("updates").add({
      text,
      date: Date.now(),
      author: currentUser.email
    });

    textBox.value = "";
  } catch (err) {
    console.error("Post failed:", err);
    alert("Failed to post update.");
  }
}

// ===== Delete update =====
async function deletePost(id) {
  if (!isAdmin) {
    alert("Not authorized");
    return;
  }

  if (!confirm("Delete this update?")) return;

  try {
    await db.collection("updates").doc(id).delete();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete.");
  }
}

// ===== Live updates listener =====
db.collection("updates")
  .orderBy("date", "desc")
  .onSnapshot(snapshot => {
    updatesCache = [];

    snapshot.forEach(doc => {
      updatesCache.push({
        id: doc.id,
        data: doc.data()
      });
    });

    renderUpdates();
  });

// ===== Safety =====
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}
