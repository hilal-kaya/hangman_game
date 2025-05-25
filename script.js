const letterpart = document.getElementById("letter-part");
const optionspart = document.getElementById("options-part");
const userInputSection = document.getElementById("user-input-section");
const newGamepart = document.getElementById("new-game-part");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");
document.getElementById("game-music").play();

let options = {
  animals: [
    "lion", "zebra", "turtle", "dog", "parrot", "eagle", "elephant", "bear", 
    "fox", "dolphin", "kangaroo", "raccoon", "panther", "otter", "hedgehog"
  ],
  countries: [
    "turkey", "japan", "germany", "brazil", "egypt", "france", "italy", "india", 
    "canada", "australia", "sweden", "argentina", "thailand", "portugal", "greece"
  ],
  jobs: [
    "doctor", "teacher", "engineer", "chef", "police", "lawyer", "veterinarian", 
    "pilot", "driver", "tailor", "firefighter", "scientist", "actor", "architect", "barber"
  ],
  foods: [
    "pizza", "baklava", "dumpling", "kebab", "soup", "menemen", "delight", "bagel", 
    "olive", "burrito", "lasagna", "hummus", "sushi", "croissant"
  ],
  objects: [
    "chair", "table", "mirror", "phone", "computer", "bag", "book", "pen", "lamp", 
    "notebook", "backpack", "keyboard", "remote", "bicycle"
  ],
  advanced: [
    "meridian", "mythology", "quarantine", "criticism", "strategy", "psychology", 
    "geopolitics", "paradigm", "aristocracy", "contractor", "artisan", "mediation", 
    "synonym", "forecaster", "integration", "innovation", "hypothesis", "phenomenon", 
    "biodiversity", "sustainability"
  ],
};

//Sayaclar
let winCount = 0;
let count = 0;
let guessedWord = "";

//Seçenek tuşları
const displayOptions = () => {
  optionspart.innerHTML += `<h3>Please select a category: </h3>`;
  let buttonCon = document.createElement("div");
  for (let value in options) {
    buttonCon.innerHTML += `<button class="options" onclick="generateWord('${value}')">${value}</button>`;
  }
  optionspart.appendChild(buttonCon);
};

//Tuşları pasifleştirme
const blocker = () => {
  let optionsButtons = document.querySelectorAll(".options");
  let letterButtons = document.querySelectorAll(".letters");
  //tüm kategori düğmelerini pasifleştir
  optionsButtons.forEach((button) => {
    button.disabled = true;
  });
  //harfleri pasifleştirme
  letterButtons.forEach((button) => {
    button.disabled.true;
  });
  newGamepart.classList.remove("hide");
};

//kelime üretici
const generateWord = (optionValue) => {
  let optionsButtons = document.querySelectorAll(".options");
  //seclen tus belirtme
  optionsButtons.forEach((button) => {
    if (button.innerText.toLowerCase() === optionValue) {
      button.classList.add("active");
    }
    button.disabled = true;
  });
  //önceki kelimeyi temizle ve harfleri göster
  letterpart.classList.remove("hide");
  userInputSection.innerText = "";
  let optionArray = options[optionValue];
  //rastgele kelime seç
  guessedWord = optionArray[Math.floor(Math.random() * optionArray.length)];
  guessedWord = guessedWord.toUpperCase();
  //harfleri "_" ile değiştir
  let displayItem = guessedWord.replace(/./g, '<span class="dashes"> _ </span>');
  //her karakteri span olarak göster
  userInputSection.innerHTML = displayItem;
};
const toggleMusic = () => {
  const music = document.getElementById("game-music");
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
};

//Başlangıç Fonksiyonu
const initializer = () => {
  stopSwing(); // ➕ Sallanmayı durdur
  userInputSection.innerText = "";

  winCount = 0;
  count = 0;
  resultText.innerHTML = "";
  //içeriği temizle, harfleri ve yeni oyun düğmesinikapat
  optionspart.innerHTML = "";
  letterpart.classList.add("hide");
  newGamepart.classList.add("hide");
  letterpart.innerHTML = "";
  //Harf tuslarını oluştur
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    //ASCII numarasını harfe çevir 
    button.innerText = String.fromCharCode(i);
    //Harf tıklama olayı
    button.addEventListener("click", () => {
      let charArray = guessedWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      //kelime harfi içeriyorsa yerine koy yoksa yanlış sayacını artır
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          if (char === button.innerText) {
            //alt çizgi yerine harfi yaz
            dashes[index].innerText = char;
            //kazanma sayacını artır
            winCount += 1;
            //tüm harfler bulunduysa oyunu kazan
            if (winCount == charArray.length) {
              resultText.innerHTML = `<h2 class='win-msg'>WIN!!</h2><p>Word: <span>${guessedWord}</span></p>`;
              blocker();
            }
          }
        });
      } else {
        //yanlış tahmin sayacını artır
        count += 1;
        //adamı çiz
        drawMan(count);
        //6 yanlışta oyunu kaybet
        if (count == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'>FAILED!!</h2><p>Word: <span>${guessedWord}</span></p>`;
          blocker();
        }
      }
      //Tiklanan harfi pasifleştir
      button.disabled = true;
    });
    letterpart.append(button);
  }
  displayOptions();
  //Canvas'ı başlat
  let { initialDrawing } = canvasCreator();
  initialDrawing();
};

const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  //Çizgi çizme fonksiyonu
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };
  //Baş çiz
  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };
  //Gövde çiz
  const body = () => {
    drawLine(70, 40, 70, 80);
  };
  //Sol kol çiz
  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };
  //Sağ kol çiz
  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };
  //Sol bacak çiz
  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };
  //Sağ bacak çiz
  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };
  //çerçeve çizimi
  const initialDrawing = () => {
    //canvas'ı temizle
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //alt çizgi
    drawLine(10, 130, 130, 130);
    //sol çizgi
    drawLine(10, 10, 10, 131);
    //üst çizgi
    drawLine(10, 10, 70, 10);
    //askı çizgisi
    drawLine(70, 10, 70, 20);
  };
  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

//Adamı çiz
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      startSwing();// Sallanma başlasın
      break;
    default:
      break;
  }
};


const drawHangingMan = (context) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  head();
  body();
  leftArm();
  rightArm();
  leftLeg();
  rightLeg();
};

let swingAngle = 0;
let swingDirection = 1;
let swingInterval = null;

const startSwing = () => {
  if (swingInterval) return;

  let context = canvas.getContext("2d");
  let { initialDrawing } = canvasCreator();

  swingInterval = setInterval(() => {
    swingAngle += swingDirection * 1;

    if (swingAngle > 5 || swingAngle < -5) {
      swingDirection *= -1;
    }

    // Tüm tuvali temizle
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Askı ve çerçeve sabit çiz
    initialDrawing();

    // Adamı döndürerek çiz
    context.translate(70, 20); // Askı ucuna göre merkezle
    context.rotate((swingAngle * Math.PI) / 180);
    context.translate(-70, -20);

    drawHangingMan(context); // Adamı çiz

    context.setTransform(1, 0, 0, 1, 0, 0); // Reset
  }, 50);
};
const stopSwing = () => {
  if (swingInterval) {
    clearInterval(swingInterval);
    swingInterval = null;
    swingAngle = 0;
  }
};

//Yeni Oyuna başla 
newGameButton.addEventListener("click", initializer);
newGameButton.addEventListener("click", () => {
  initializer();
  document.getElementById("game-music").play(); // müzik başlat
});

window.onload = initializer;
