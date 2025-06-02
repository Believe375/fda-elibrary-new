// Sample static data – can be replaced with dynamic data from your backend
const archives = [
  {
    title: "Annual Food Safety Report",
    category: "Reports",
    date: "May 2025",
    year: "2025",
    download: "#",
    view: "#"
  },
  {
    title: "FDA Drug Policy Update",
    category: "Policy",
    date: "January 2024",
    year: "2024",
    download: "#",
    view: "#"
  },
  {
    title: "Research on Drug Interactions",
    category: "Research",
    date: "October 2023",
    year: "2023",
    download: "#",
    view: "#"
  },
  {
    title: "Public Announcement: Product Recall",
    category: "Announcements",
    date: "March 2025",
    year: "2025",
    download: "#",
    view: "#"
  }
];

// DOM Elements
const archiveList = document.getElementById("archiveList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const yearFilter = document.getElementById("yearFilter");

// Render archive entries
function renderArchives(data) {
  archiveList.innerHTML = "";

  if (data.length === 0) {
    archiveList.innerHTML = `<p>No results found.</p>`;
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "archive-card";
    card.innerHTML = `
      <div class="info">
        <h3>${item.title}</h3>
        <p class="meta">Category: ${item.category} | Date: ${item.date}</p>
      </div>
      <div class="actions">
        <a href="${item.view}" class="btn view" target="_blank">View</a>
        <a href="${item.download}" class="btn download" target="_blank">Download</a>
      </div>
    `;
    archiveList.appendChild(card);
  });
}

// Filter logic
function filterArchives() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedYear = yearFilter.value;

  const filtered = archives.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
    const matchesYear = selectedYear === "" || item.year === selectedYear;

    return matchesSearch && matchesCategory && matchesYear;
  });

  renderArchives(filtered);
}

// Event listeners
searchInput.addEventListener("input", filterArchives);
categoryFilter.addEventListener("change", filterArchives);
yearFilter.addEventListener("change", filterArchives);

// Initial render
renderArchives(archives);