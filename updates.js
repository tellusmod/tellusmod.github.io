const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPanel = document.getElementById("adminPanel");
const updatesDiv = document.getElementById("updates");

loginBtn.onclick = async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
};

logoutBtn.onclick = () => auth.signOut();

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";

    // 👑 Only YOU see admin panel
    if (user.email === ADMIN_EMAIL) {
      adminPanel.style.display = "block";
    }
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    adminPanel.style.display = "none";
  }
});

// Post update
async function postUpdate() {
  const text = document.getElementById("postText").value;
  if (!text.trim()) return;

  await db.collection("updates").add({
    text,
    date: Date.now()
  });

  document.getElementById("postText").value = "";
}

// Load updates
db.collection("updates")
  .orderBy("date", "desc")
  .onSnapshot(snapshot => {
    updatesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      updatesDiv.innerHTML += `
        <div class="post">
          ${data.text}
        </div>
      `;
    });
  });