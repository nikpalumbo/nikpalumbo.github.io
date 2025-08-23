---
layout: default
title: "AI Agent & Growth Systems Case Studies | Proven Results"
description: "Real AI agent development and intelligent growth systems case studies. See measurable results from TrueFit AI, ETFProfiler, QuiteMatch, and enterprise growth systems."
keywords: "AI agent case studies, growth systems results, TrueFit AI, ETFProfiler, QuiteMatch, startup growth, conversion optimization, SaaS results"
---

<!-- Case Studies Header -->
<div class="case-studies-header">
  <div class="container">
    <div class="row">
      <div class="col col-12">
        <div class="case-studies-header__content">
          <h1 class="case-studies-title">Case Studies</h1>
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
        <div class="category-filters">
          <button class="filter-btn active" data-category="all">All Projects</button>
          <button class="filter-btn" data-category="Intelligent Growth Systems">Growth Systems</button>
          <button class="filter-btn" data-category="AI Agent Development">AI Agents</button>
        </div>
      </div>
    </div>

    <!-- Case Studies Grid -->
    <div class="row">
      <div class="col col-12">
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
