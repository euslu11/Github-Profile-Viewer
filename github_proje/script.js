const searchInput = document.getElementById("searchInput");
const buttonSearch = document.getElementById("buttonSearch");
const userInfo = document.getElementById("userInfo");
const repoList = document.getElementById("repoList");
const recentSearches = document.getElementById("recentSearches");
const clearSearches = document.getElementById("clearSearches");

buttonSearch.addEventListener("click", () => {
  const username = searchInput.value.trim();
  if (username !== "") {
    getUserInfo(username);
    getRepos(username);
    addRecentSearch(username);
    userInfo.style.display = "block";
  }
});

function getUserInfo(username) {
  fetch(`https://api.github.com/users/${username}`)
    .then((response) => response.json())
    .then((data) => {
      userInfo.innerHTML = `
        <div class="text-center">
          <img src="${
            data.avatar_url
          }" alt="Avatar" style="width: 250px; height: 250px;border-radius:50%;margin-bottom:20px;">
          <p><strong>Username:</strong> ${data.login}</p>
          <p><strong>Name:</strong> ${data.name || "-"}</p>
          <p><strong>Location:</strong> ${data.location || "-"}</p>
          <p><strong>Bio:</strong> ${data.bio || "-"}</p>
          <p><strong>Email:</strong> ${data.email || "-"}</p>
        </div>
      `;
    })
    .catch((error) => console.error("Error fetching user info:", error));
}

function getRepos(username) {
  fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => response.json())
    .then((data) => {
      repoList.innerHTML = data
        .map(
          (repo) => `
        <tr>
          <td><a href="${repo.html_url}" target="_blank">${repo.name}</a></td>
          <td>${repo.stargazers_count}</td>
          <td>${repo.forks_count}</td>
        </tr>
      `
        )
        .join("");
    })
    .catch((error) => console.error("Error fetching repos:", error));
}

function addRecentSearch(username) {
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  searches.unshift(username);
  localStorage.setItem("recentSearches", JSON.stringify(searches.slice(0, 5)));
  displayRecentSearches();
}

function displayRecentSearches() {
  const searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
  recentSearches.innerHTML = searches
    .map(
      (username) => `
    <tr>
      <td>${username}</td>
    </tr>
  `
    )
    .join("");
}

clearSearches.addEventListener("click", () => {
  localStorage.removeItem("recentSearches");
  displayRecentSearches();
});

displayRecentSearches();
