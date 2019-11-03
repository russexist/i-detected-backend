const defaultViewContainer = document.querySelector(".default-view");
const picViewContainer = document.querySelector(".pic-view");
const textViewContainer = document.querySelector(".text-view");

function hideAll() {
  if (getComputedStyle(defaultViewContainer).display === "block") {
    console.log("hide default");
    defaultViewContainer.style.animationName = "zoomOut";
    defaultViewContainer.style.animationDuration = "1s";
    setTimeout(() => (defaultViewContainer.style.display = "none"), 950);
  } else if (getComputedStyle(picViewContainer).display === "block") {
    console.log("hide pic");
    picViewContainer.style.animationName = "zoomOut";
    picViewContainer.style.animationDuration = "1s";
    setTimeout(() => {
      picViewContainer.style.backgroundImage = "";
      picViewContainer.style.display = "none";
    }, 950);
  } else if (getComputedStyle(textViewContainer).display === "block") {
  }
}

function showDefaultView() {
  hideAll();
  defaultViewContainer.addEventListener("animationend", () =>
    console.log("dasdasdsa")
  );
  setTimeout(() => {
    defaultViewContainer.style.animationName = "zoomIn";
    defaultViewContainer.style.animationDuration = "1s";
    defaultViewContainer.style.display = "block";
    setTimeout(() => {
      defaultViewContainer.style.animationName = "anim-pulsing";
      defaultViewContainer.style.animationDuration = "7s";
      defaultViewContainer.style.animationIterationCount = "Infinity";
    }, 950);
  }, 950);
}

function showPicView(imageUrl) {
  hideAll();
  picViewContainer.style.backgroundImage = `url(${imageUrl})`;
  setTimeout(() => {
    picViewContainer.style.animationName = "zoomIn";
    picViewContainer.style.animationDuration = "1s";
    picViewContainer.style.animationIterationCount = "1";
    picViewContainer.style.display = "block";
  }, 950);
}

// setTimeout(
//   () =>
//     showPicView(
//       "https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg"
//     ),
//   2000
// );
// setTimeout(() => showDefaultView(), 8000);
