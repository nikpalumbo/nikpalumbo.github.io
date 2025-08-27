---
layout: default
title: "AI Case Studies for Startups, SMEs, and Enterprises"
description: "Explore how startups, SMEs, and enterprises use AI growth systems, agents, and smart websites to scale faster with measurable results."
keywords: "AI agent case studies, growth systems results, TrueFit AI, ETFProfiler, QuiteMatch, startup growth, conversion optimization, SaaS results"
---

<!-- Case Studies Header -->
<div class="case-studies-header">
  <div class="container">
    <div class="row">
      <div class="col col-12">
        <div class="case-studies-header__content">
          <h1 class="case-studies-title">AI Case Studies for Startups, SMEs, and Enterprises</h1>
          <p class="case-studies-description">Real projects. Measurable results. Proven methodologies.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Case Studies Grid -->
<div class="case-studies-content">
  <div class="container">
    
    <!-- Category Filter (Optional) -->
    <div class="row">
      <div class="col col-12">
        <h2 class="case-studies-section-title">Browse by Category</h2>
        <div class="category-filters">
          <button class="filter-btn active" data-category="all">
            <i class="fas fa-th-large"></i>
            All Projects
          </button>
          <button class="filter-btn" data-category="Intelligent Growth Systems">
            <i class="fas fa-chart-line"></i>
            Intelligent Growth Systems
          </button>
          <button class="filter-btn" data-category="AI Agent Development">
            <i class="fas fa-robot"></i>
            AI Agent Development
          </button>
          <button class="filter-btn" data-category="Smart Conversion Websites">
            <i class="fas fa-globe"></i>
            Smart Conversion Websites
          </button>
          <button class="filter-btn" data-category="Product-Led Growth Prototyping">
            <i class="fas fa-rocket"></i>
            Product-Led Growth Prototyping
          </button>
        </div>
      </div>
    </div>

    <!-- Case Studies Description -->
    <div class="row">
      <div class="col col-12">
        <div class="case-studies-intro">
          <p class="case-studies-subdescription">Discover how we've helped startups, SMEs, and enterprises scale faster with AI-powered growth systems, intelligent agents, and conversion-optimized websites. Each case study shows real results and proven methodologies.</p>
        </div>
      </div>
    </div>

    <!-- Case Studies Grid -->
    <div class="row">
      <div class="col col-12">
        <h2 class="case-studies-section-title">Featured Case Studies</h2>
        <div class="case-studies-grid">
          {% assign sorted_works = site.works | sort: 'date' | reverse %}
          {% for work in sorted_works %}
          <article class="case-study-card" data-category="{{ work.category }}">
            <div class="case-study-card__header">
              {% if work.category %}
              <div class="case-study-card__category">{{ work.category }}</div>
              {% endif %}
              <h3 class="case-study-card__title">
                <a href="{{ work.url }}">{{ work.title }}</a>
              </h3>
            </div>
            
            <div class="case-study-card__body">
              {% if work.subtitle %}
              <p class="case-study-card__description">{{ work.subtitle }}</p>
              {% elsif work.description %}
              <p class="case-study-card__description">{{ work.description }}</p>
              {% endif %}
              
              <div class="case-study-card__footer">
                <div class="case-study-card__meta">
                  {% if work.role %}
                  <div class="meta-item">
                    <i class="ion ion-md-person"></i>
                    <span class="meta-value">{{ work.role }}</span>
                  </div>
                  {% endif %}
                  {% if work.client %}
                  <div class="meta-item">
                    <i class="ion ion-md-briefcase"></i>
                    <span class="meta-value">{{ work.client }}</span>
                  </div>
                  {% endif %}
                </div>
                
                <a href="{{ work.url }}" class="case-study-card__link">View Case Study</a>
              </div>
            </div>
          </article>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</div>
