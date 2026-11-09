(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var counter = document.getElementById("counter");
  var progressFill = document.getElementById("progress-fill");
  var prevBtn = document.getElementById("prev-btn");
  var nextBtn = document.getElementById("next-btn");
  var total = slides.length;
  var current = 0;

  function updateHash() {
    try {
      history.replaceState(null, "", "#" + (current + 1));
    } catch (error) {
      /* تحديث الهاش اختياري؛ التنقل يعمل بدونه */
    }
  }

  function show(index) {
    current = Math.max(0, Math.min(total - 1, index));

    slides.forEach(function (slide, i) {
      var active = i === current;
      slide.hidden = !active;
      slide.inert = !active;
      if (active) {
        slide.removeAttribute("inert");
        slide.setAttribute("aria-hidden", "false");
      } else {
        slide.setAttribute("inert", "");
        slide.setAttribute("aria-hidden", "true");
      }
    });

    counter.textContent = (current + 1) + " / " + total;
    progressFill.style.width = (((current + 1) / total) * 100) + "%";

    prevBtn.setAttribute("aria-disabled", current === 0 ? "true" : "false");
    nextBtn.setAttribute("aria-disabled", current === total - 1 ? "true" : "false");

    updateHash();
  }

  function goNext() {
    if (nextBtn.getAttribute("aria-disabled") !== "true") {
      show(current + 1);
    }
  }

  function goPrev() {
    if (prevBtn.getAttribute("aria-disabled") !== "true") {
      show(current - 1);
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    var focused = document.activeElement;
    var onControl = !!focused && (focused.tagName === "A" || focused.tagName === "BUTTON");

    switch (event.key) {
      case "ArrowLeft":
        goNext();
        break;
      case "ArrowRight":
        goPrev();
        break;
      case " ":
      case "Spacebar":
        if (onControl) {
          return;
        }
        event.preventDefault();
        if (event.shiftKey) {
          goPrev();
        } else {
          goNext();
        }
        break;
      case "Home":
        event.preventDefault();
        show(0);
        break;
      case "End":
        event.preventDefault();
        show(total - 1);
        break;
    }
  });

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  /* الجذر بلا hash = الشريحة 1 دائمًا؛ ويُقرأ #n عند التحميل إن وُجد */
  var hashMatch = /^#([0-9]+)$/.exec(window.location.hash);
  var startIndex = hashMatch ? parseInt(hashMatch[1], 10) - 1 : 0;
  show(startIndex);
})();
