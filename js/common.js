document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  var html = document.querySelector('html'),
    menuToggle = document.querySelector(".hamburger"),
    menuList = document.querySelector(".main-nav"),
    toggleTheme = document.querySelector(".toggle-theme-js"),
    btnScrollToTop = document.querySelector(".top");


  /* =======================================================
  // Menu + Theme Switcher
  ======================================================= */
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      menu();
    });
  }

  function menuOpen() {
    menuList.classList.add("is-open");
  }


  // Menu
  function menu() {
    menuToggle.classList.toggle("is-open");
    menuList.classList.toggle("is-visible");
  }

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      darkMode();
    });
  };


  // Theme Switcher
  function darkMode() {
    if (html.classList.contains('dark-mode')) {
      html.classList.remove('dark-mode');
      localStorage.removeItem("theme");
      document.documentElement.removeAttribute("dark");
    } else {
      html.classList.add('dark-mode');
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("dark", "");
    }
  }


  /* ================================================================
  // Stop Animations During Window Resizing and Switching Theme Modes
  ================================================================ */
  let disableTransition;

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      stopAnimation();
    });

    window.addEventListener("resize", () => {
      stopAnimation();
    });

    function stopAnimation() {
      document.body.classList.add("disable-animation");
      clearTimeout(disableTransition);
      disableTransition = setTimeout(() => {
        document.body.classList.remove("disable-animation");
      }, 100);
    }
  }


  /* =======================
  // Responsive Videos
  ======================= */
  
  // Reframe function for responsive iframes
  function reframe(selector) {
    const iframes = document.querySelectorAll(selector);
    iframes.forEach(iframe => {
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = 'auto';
        iframe.style.aspectRatio = '16/9';
      }
    });
  }
  
  reframe(".post iframe:not(.reframe-off), .page iframe:not(.reframe-off)");


  /* =======================
  // LazyLoad Images
  ======================= */
  // LazyLoad library not available - commenting out for now
  // var lazyLoadInstance = new LazyLoad({
  //   elements_selector: ".lazy"
  // })


  /* =======================
  // Zoom Image
  ======================= */
  const lightense = document.querySelector(".page img, .post img, .gallery__image img"),
  imageLink = document.querySelectorAll(".page a img, .post a img, .gallery__image a img");

  if (imageLink) {
    for (var i = 0; i < imageLink.length; i++) imageLink[i].parentNode.classList.add("image-link");
    for (var i = 0; i < imageLink.length; i++) imageLink[i].classList.add("no-lightense");
  }

  if (lightense) {
    // Lightense library not available - commenting out for now
    // Lightense(".page img:not(.no-lightense), .post img:not(.no-lightense), .gallery__image img:not(.no-lightense)", {
    // padding: 60,
    // offset: 30
    // });
  }


  // =====================
  // Load More Posts
  // =====================
  var load_posts_button = document.querySelector('.load-more-posts');

  if (load_posts_button) {
    load_posts_button.addEventListener("click", function(e) {
      e.preventDefault();
      var pagination = document.querySelector(".pagination");
      var nextUrl = pagination_next_url.split("/page")[0] + "/page/" + pagination_next_page_number + "/";
      
      fetch(nextUrl)
        .then(function(response) {
          if (response.ok) return response.text();
        })
        .then(function(html) {
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = html;
          var grid = document.querySelector(".grid");
          var posts = tempDiv.querySelectorAll(".grid__post");
          
          for (var i = 0; i < posts.length; i++) {
            grid.appendChild(posts.item(i));
          }
          
          pagination_next_page_number++;
          if (pagination_next_page_number > pagination_available_pages_number) {
            pagination.style.display = "none";
          }
        });
    });
  }


  /* =======================
  // Scroll Top Button
  ======================= */
  window.addEventListener("scroll", function () {
    window.scrollY > window.innerHeight ? btnScrollToTop.classList.add("is-active") : btnScrollToTop.classList.remove("is-active");
  });

  btnScrollToTop.addEventListener("click", function () {
    if (window.scrollY != 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  });

});
