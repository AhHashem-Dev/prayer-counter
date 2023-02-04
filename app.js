// prayers
const prayersNames = ["Fajr", "Zuhr", "Asr", "Maghrib", "Isha"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Nobember",
  "December",
];
const oneDay = 60 * 60 * 24 * 1000;

// selectors
const prayers = document.querySelectorAll(".prayer:not(.total)");
const buttons = document.querySelectorAll(".prayer-buttons");
const totalPrayer = document.querySelector(".total");
const increaseBtn = document.querySelector(".increase-btn");
const decreaseBtn = document.querySelector(".decrease-btn");
const autoBtn = document.querySelector(".auto-btn");
const time = document.querySelector(".time");

// event listeners
buttons.forEach(function (buttonSet) {
  const upBtn = buttonSet.querySelector(".prayer-button-up");
  const downBtn = buttonSet.querySelector(".prayer-button-down");

  upBtn.addEventListener("click", function (event) {
    let prayerCounter =
      event.currentTarget.parentElement.previousElementSibling;
    const prayerTitle =
      event.currentTarget.parentElement.parentElement.querySelector(
        ".prayer-title"
      ).innerHTML;
    prayerCounter.innerHTML = parseInt(prayerCounter.innerHTML) + 1;
    if (prayerCounter.innerHTML > 0) {
      downBtn.style.visibility = "visible";
    }
    checkDecreaseAllButton();
    updateTotalCounter();
    updateDate(new Date());
    checkAutoButton();
    // add to local storage
    let storage = JSON.parse(localStorage.getItem("prayers"));
    storage[prayerTitle] = prayerCounter.innerHTML;
    localStorage.setItem("prayers", JSON.stringify(storage));
  });

  downBtn.addEventListener("click", function (event) {
    let prayerCounter =
      event.currentTarget.parentElement.previousElementSibling;
    const prayerTitle =
      event.currentTarget.parentElement.parentElement.querySelector(
        ".prayer-title"
      ).innerHTML;
    if (prayerCounter.innerHTML > 0) {
      prayerCounter.innerHTML = parseInt(prayerCounter.innerHTML) - 1;
      if (prayerCounter.innerHTML == 0) {
        downBtn.style.visibility = "hidden";
      }
    }
    checkDecreaseAllButton();
    updateTotalCounter();
    updateDate(new Date());
    checkAutoButton();
    // add to local storage
    let storage = JSON.parse(localStorage.getItem("prayers"));
    storage[prayerTitle] = prayerCounter.innerHTML;
    localStorage.setItem("prayers", JSON.stringify(storage));
  });
});

increaseBtn.addEventListener("click", function (event) {
  increaseAll(event, 1);
});

decreaseBtn.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn")) {
    if (!decreaseBtn.classList.contains("inactive-btn")) {
      prayers.forEach(function (prayer) {
        const prayerCounter = prayer.querySelector(".prayer-counter");
        const prayerTitle = prayer.querySelector(".prayer-title").innerHTML;
        const downBtn = prayer.querySelector(".prayer-button-down");
        if (prayerCounter.innerHTML > 0) {
          prayerCounter.innerHTML = parseInt(prayerCounter.innerHTML) - 1;
          if (prayerCounter.innerHTML == 0) {
            downBtn.style.visibility = "hidden";
          }
        }
        checkDecreaseAllButton();
        updateTotalCounter();
        updateDate(new Date());
        checkAutoButton();
        // add to local storage
        let storage = JSON.parse(localStorage.getItem("prayers"));
        storage[prayerTitle] = prayerCounter.innerHTML;
        localStorage.setItem("prayers", JSON.stringify(storage));
      });
    }
  }
});

autoBtn.addEventListener("click", function (event) {
  if (event.target.classList.contains("btn")) {
    if (!autoBtn.classList.contains("inactive-btn")) {
      let currentDate = new Date();
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      let storage = JSON.parse(localStorage.getItem("prayers"));
      const storageDate = storage.Date;
      let timeDifference =
        currentDate -
        new Date(`${storageDate[1] + 1}/${storageDate[0]}/${storageDate[2]}`);
      let dayDifference = Math.floor(timeDifference / oneDay);
      increaseAll(event, dayDifference);
      updateDate(currentDate);
      checkAutoButton();
    }
  }
});

// functions
function checkDecreaseAllButton() {
  let allGood = true;
  prayers.forEach(function (prayer) {
    const prayerCounter = prayer.querySelector(".prayer-counter").innerHTML;
    if (parseInt(prayerCounter) < 1) {
      allGood = false;
    }
  });
  if (allGood) {
    decreaseBtn.classList.remove("inactive-btn");
  } else {
    decreaseBtn.classList.add("inactive-btn");
  }
}

function updateTotalCounter() {
  let totalCounter = totalPrayer.querySelector(".total-counter");
  totalCounter.innerHTML = Array.from(prayers).reduce(function (
    total,
    currentPrayer
  ) {
    total += parseInt(currentPrayer.querySelector(".prayer-counter").innerHTML);
    return total;
  },
  0);
}

function increaseAll(event, num) {
  if (event.target.classList.contains("btn")) {
    prayers.forEach(function (prayer) {
      const prayerCounter = prayer.querySelector(".prayer-counter");
      const prayerTitle = prayer.querySelector(".prayer-title").innerHTML;
      const downBtn = prayer.querySelector(".prayer-button-down");
      prayerCounter.innerHTML = parseInt(prayerCounter.innerHTML) + 1 * num;
      checkDecreaseAllButton();
      updateTotalCounter();
      updateDate(new Date());
      checkAutoButton();
      if (prayerCounter.innerHTML > 0) {
        downBtn.style.visibility = "visible";
      }
      // add to local storage
      let storage = JSON.parse(localStorage.getItem("prayers"));
      storage[prayerTitle] = prayerCounter.innerHTML;
      localStorage.setItem("prayers", JSON.stringify(storage));
    });
  }
}

function updateDate(currentDate) {
  let storage = JSON.parse(localStorage.getItem("prayers"));
  currentDate = [
    currentDate.getDate(),
    currentDate.getMonth(),
    currentDate.getFullYear(),
  ];
  storage["Date"] = currentDate;
  time.innerHTML = `${currentDate[0]} ${months[currentDate[1]]}, ${
    currentDate[2]
  }`;
  localStorage.setItem("prayers", JSON.stringify(storage));
}

function checkAutoButton() {
  let currentDate = new Date();
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  let storage = JSON.parse(localStorage.getItem("prayers"));
  const storageDate = storage.Date;
  let timeDifference =
    currentDate -
    new Date(`${storageDate[1] + 1}/${storageDate[0]}/${storageDate[2]}`);
  if (Math.floor(timeDifference / oneDay) < 1) {
    autoBtn.classList.add("inactive-btn");
  } else if (Math.floor(timeDifference / oneDay) >= 1) {
    autoBtn.classList.remove("inactive-btn");
  }
}

// setup
let initialDate = new Date();
initialDate.setDate(initialDate.getDate() - 1);
const day = initialDate.getDate();
const month = initialDate.getMonth();
const year = initialDate.getFullYear();

let storage = JSON.parse(localStorage.getItem("prayers"))
  ? JSON.parse(localStorage.getItem("prayers"))
  : { Fajr: 0, Zuhr: 0, Asr: 0, Maghrib: 0, Isha: 0, Date: [day, month, year] };
localStorage.setItem("prayers", JSON.stringify(storage));

window.addEventListener("DOMContentLoaded", function () {
  prayers.forEach(function (prayer, index) {
    const prayerTitle = prayer.querySelector(".prayer-title");
    const prayerCounter = prayer.querySelector(".prayer-counter");
    prayerTitle.innerHTML = prayersNames[index];
    prayerCounter.innerHTML = storage[prayerTitle.innerHTML];
  });
  checkDecreaseAllButton();
  updateTotalCounter();
  checkAutoButton();

  const storageDate = storage.Date;
  time.innerHTML = `${storageDate[0]} ${months[storageDate[1]]}, ${
    storageDate[2]
  }`;
});

window.addEventListener("load", function () {
  const loaderPage = document.querySelector(".loader-page");
  setTimeout(function () {
    loaderPage.classList.add("loader-hidden");
  }, 1000);
});
