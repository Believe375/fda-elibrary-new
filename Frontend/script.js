// DOM Elements
const archiveList = document.getElementById("archiveList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const yearFilter = document.getElementById("yearFilter");

// Fetch archive data from backend (placeholder function)
// Replace this later with actual fetch from your backend API
async function fetchArchives() {
  // Sample static fallback
  return [
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
}

// Render archive entries
function renderArchives(data) {
  archiveList.innerHTML = "";

  if (data.length === 0) {
    archiveList.innerHTML = <p>No results found.</p>;
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
function filterArchives(allData) {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedYear = yearFilter.value;

  const filtered = allData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "" || item.category === selectedCategory;
    const matchesYear = selectedYear === "" || item.year === selectedYear;
    return matchesSearch && matchesCategory && matchesYear;
  });

  renderArchives(filtered);
}

// Initialize and bind everything
async function initialize() {
  const archives = await fetchArchives();

  // Populate dynamic year filter
  const uniqueYears = [...new Set(archives.map(item => item.year))].sort().reverse();
  yearFilter.innerHTML = <option value="">All Years</option> +
    uniqueYears.map(year => <option value="${year}">${year}</option>).join("");

  // Populate dynamic category filter
  const uniqueCategories = [...new Set(archives.map(item => item.category))].sort();
  categoryFilter.innerHTML = <option value="">All Categories</option> +
    uniqueCategories.map(cat => <option value="${cat}">${cat}</option>).join("");

  // Initial render
  renderArchives(archives);

  // Event listeners
  searchInput.addEventListener("input", () => filterArchives(archives));
  categoryFilter.addEventListener("change", () => filterArchives(archives));
  yearFilter.addEventListener("change", () => filterArchives(archives));
}

// Start app
initialize();