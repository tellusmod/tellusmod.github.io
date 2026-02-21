// ===== Elements =====
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");
const updatesDiv = document.getElementById("updates");

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

// ===== Auth state =====
auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    // 👑 Only admin sees posting tools
    if (user.email === ADMIN_EMAIL) {
      adminPanel.style.display = "block";
    } else {
      adminPanel.style.display = "none";
    }
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    adminPanel.style.display = "none";
  }
});

// ===== Post update =====
async function postUpdate() {
  const user = auth.currentUser;
  if (!user || user.email !== ADMIN_EMAIL) {
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
      author: user.email
    });

    textBox.value = "";
  } catch (err) {
    console.error("Post failed:", err);
    alert("Failed to post update.");
  }
}

// ===== Delete update =====
async function deletePost(id) {
  const user = auth.currentUser;
  if (!user || user.email !== ADMIN_EMAIL) {
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
    updatesDiv.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const id = doc.id;

      const isAdmin =
        auth.currentUser &&
        auth.currentUser.email === ADMIN_EMAIL;

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
  });

// ===== Safety: prevent HTML injection =====
function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}
