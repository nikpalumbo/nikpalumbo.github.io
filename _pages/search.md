---
layout: default
title: "SDW Solutions - Search Results"
description: "Search SDW Solutions for AI agent development, intelligent growth systems, smart conversion websites, and case studies. Find the information you need quickly and easily."
keywords: "SDW Solutions search, AI agent development search, intelligent growth systems search, smart conversion websites search, case studies search, Swiss AI expert search"
image: '/images/social_home.jpg'
permalink: /search/
robots: "index, follow"
---

<div class="search-page">
  <div class="container">
    <div class="row">
      <div class="col col-12">
        <div class="search-header">
          <h1 class="search-title">Search Results</h1>
          <div class="search-form">
            <form id="searchForm" class="search-form-inline">
              <input type="text" id="searchInput" placeholder="Search SDW Solutions..." class="search-input" value="{{ page.search_query | default: '' }}">
              <button type="submit" class="search-button">
                <i class="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div id="searchResults" class="search-results">
          <div class="search-loading" style="display: none;">
            <p>Searching...</p>
          </div>
          <div class="search-no-results" style="display: none;">
            <p>No results found. Try different keywords.</p>
          </div>
          <div class="search-results-list">
            <!-- Results will be populated by JavaScript -->
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
.search-page {
  padding: 60px 0;
}

.search-header {
  text-align: center;
  margin-bottom: 40px;
}

.search-title {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: var(--text-color);
}

.search-form-inline {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  gap: 10px;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.search-button {
  padding: 15px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: var(--primary-color-dark);
}

.search-results {
  max-width: 800px;
  margin: 0 auto;
}

.search-result-item {
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 20px;
  transition: box-shadow 0.3s ease;
}

.search-result-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.search-result-title {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: var(--primary-color);
}

.search-result-title a {
  text-decoration: none;
  color: inherit;
}

.search-result-title a:hover {
  text-decoration: underline;
}

.search-result-excerpt {
  color: var(--text-alt-color);
  line-height: 1.6;
  margin-bottom: 10px;
}

.search-result-url {
  font-size: 0.9rem;
  color: var(--text-alt-color-2);
}

.search-loading, .search-no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-alt-color);
}

@media (max-width: 768px) {
  .search-form-inline {
    flex-direction: column;
  }
  
  .search-input, .search-button {
    width: 100%;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchLoading = document.querySelector('.search-loading');
  const searchNoResults = document.querySelector('.search-no-results');
  const searchResultsList = document.querySelector('.search-results-list');

  // Get search query from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  
  if (query) {
    searchInput.value = query;
    performSearch(query);
  }

  // Handle form submission
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      // Update URL with search query
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('q', query);
      window.history.pushState({}, '', newUrl);
      
      performSearch(query);
    }
  });

  function performSearch(query) {
    showLoading();
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const results = searchContent(query);
      displayResults(results, query);
    }, 300);
  }

  function showLoading() {
    searchLoading.style.display = 'block';
    searchNoResults.style.display = 'none';
    searchResultsList.innerHTML = '';
  }

  function displayResults(results, query) {
    searchLoading.style.display = 'none';
    
    if (results.length === 0) {
      searchNoResults.style.display = 'block';
      return;
    }

    searchNoResults.style.display = 'none';
    
    const resultsHTML = results.map(result => `
      <div class="search-result-item">
        <h3 class="search-result-title">
          <a href="${result.url}">${highlightQuery(result.title, query)}</a>
        </h3>
        <div class="search-result-excerpt">
          ${highlightQuery(result.excerpt, query)}
        </div>
        <div class="search-result-url">${result.url}</div>
      </div>
    `).join('');
    
    searchResultsList.innerHTML = resultsHTML;
  }

  function highlightQuery(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function searchContent(query) {
    const searchData = [
      {
        title: "SDW Solutions - AI Agent Development & Intelligent Growth Systems",
        excerpt: "Expert AI agent development, intelligent growth systems, and smart conversion websites for startups, SMEs, and enterprises. Swiss-based SaaS founder with Fortune 500 experience delivering 24/7 automated solutions.",
        url: "/",
        keywords: ["AI agent development", "intelligent growth systems", "smart conversion websites", "startup automation", "Swiss AI developer"]
      },
      {
        title: "SDW Solutions - About Nicola Palumbo, AI Expert",
        excerpt: "Swiss-based SaaS founder who scaled to Fortune 500 clients. AI product manager and growth strategist expert in intelligent systems, AI agent development, and smart conversion websites for startups, SMEs, and enterprises.",
        url: "/about/",
        keywords: ["Nicola Palumbo", "AI product manager", "growth strategist", "SaaS founder", "Swiss AI expert", "Fortune 500 experience"]
      },
      {
        title: "SDW Solutions - Pricing",
        excerpt: "Get transparent pricing for AI growth systems, AI agent development, and smart conversion websites. Tailored solutions for startups, SMEs, and enterprises with proven results.",
        url: "/pricing/",
        keywords: ["pricing", "AI growth systems", "AI agent development", "smart conversion websites", "transparent pricing"]
      },
      {
        title: "SDW Solutions - Case Studies",
        excerpt: "Explore how startups, SMEs, and enterprises use AI growth systems, agents, and smart websites to scale faster with measurable results.",
        url: "/case-studies/",
        keywords: ["case studies", "AI agent case studies", "growth systems results", "startup growth", "conversion optimization", "SaaS results"]
      },
      {
        title: "SDW Solutions - AI Growth Roadmap",
        excerpt: "Download the complete roadmap that shows how successful companies scale from 20K to 100+ clients using AI-powered growth systems. Get the exact strategies and frameworks.",
        url: "/from-20K-to-100-clients/",
        keywords: ["AI growth roadmap", "scaling from 20K to 100 clients", "growth systems", "startup scaling", "client acquisition", "business growth"]
      },
      {
        title: "Intelligent Growth Systems",
        excerpt: "Full-funnel growth engines from value proposition to lead conversion. Define ideal customers, select channels, craft outreach, and automate CRM workflows.",
        url: "/#services",
        keywords: ["intelligent growth systems", "growth engines", "lead conversion", "CRM workflows", "value proposition"]
      },
      {
        title: "AI Agent Development",
        excerpt: "Custom AI solutions for internal tasks or customer-facing interactions. Tailored agents built on your data, not generic templates.",
        url: "/#services",
        keywords: ["AI agent development", "custom AI solutions", "AI agents", "automation", "customer interactions"]
      },
      {
        title: "Smart Conversion Websites",
        excerpt: "High-performance sites designed to convert, not just inform. AI-integrated features like guided onboarding and instant quotes.",
        url: "/#services",
        keywords: ["smart conversion websites", "high-performance sites", "conversion optimization", "AI-integrated features", "guided onboarding"]
      },
      {
        title: "Product-Led Growth Prototyping",
        excerpt: "Functional web apps that validate ideas and drive growth through real user interaction. Production-grade MVPs delivered in weeks.",
        url: "/#services",
        keywords: ["product-led growth", "prototyping", "web apps", "MVP", "user validation", "growth through interaction"]
      }
    ];

    const queryLower = query.toLowerCase();
    
    return searchData.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(queryLower);
      const excerptMatch = item.excerpt.toLowerCase().includes(queryLower);
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(queryLower)
      );
      
      return titleMatch || excerptMatch || keywordMatch;
    }).sort((a, b) => {
      // Prioritize title matches
      const aTitleMatch = a.title.toLowerCase().includes(queryLower);
      const bTitleMatch = b.title.toLowerCase().includes(queryLower);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      return 0;
    });
  }
});
</script>
