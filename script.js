let weatherApikey = "d30ef5f91ba14d56b3173652261801";
let habitCompleteCount = 0;
let vaultCount = 0;
let habitCount = 0;
document.addEventListener("DOMContentLoaded", () => {
  //for Vault Count
  function getVault() {
    for(let i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      if(key.includes("movie")){
        let data = JSON.parse(localStorage.getItem(key));
        vaultCount++;
        getMovieCard(key, data);
      } else if(key.includes("habit")){
        let data = JSON.parse(localStorage.getItem(key));
        habitCount++;
        getHabitCard(key, data);
        if(data.keyStatus === "true"){
          habitCompleteCount++;
        }
      }
    }
    getProgress(habitCompleteCount, habitCount);
    getHabitCount(habitCount);
    getVaultCount(vaultCount);
  }
  getVault();

  //for weather card
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, failure);
    } else {
      console.log("Unsupported Browser")
    }
  }

  function success(position) {
    let coords = `${position.coords.latitude}, ${position.coords.longitude}`;
    getWeather(coords);
  }

  function failure() {
    console.log("No Position Available")
  }
  getLocation();
})

async function getWeather(coords){
  
  let url = `http://api.weatherapi.com/v1/current.json?key=${weatherApikey}&q=${coords}`;

  try{
    let response = await fetch(url);
    let location = await response.json();

    let card = document.querySelector("#habit-streak-contaienr");
    let div = document.createElement("div");
    div.id = "weather-card";
    div.classList.add("streak-card");
    div.innerHTML  = `<div class="habit-card-icon"><i class="fas fa-sun"></i></div>
                      <div class="streak-card-details">
                        <p> ${location.current.temp_c}°C ${location.current.condition.text}</p>
                        <p>${location.location.name}</p>
                      </div>`;
    card.appendChild(div);
  } catch(err) {
    console.log(err);
  }
}

function getProgress(i, j) {
  let card = document.querySelector("#progress-bar div");
  console.log(card);
  console.log(i, j);
  card.style.width = `${i * 100 / j}%`;
} 

function getVaultCount(j) {
  let card = document.querySelector("#habit-streak-contaienr");
  let div = document.createElement("div");
  div.id = "vault-count-card";
  div.classList.add("streak-card");
  div.innerHTML = `<div class="habit-card-icon"><i class="fas fa-clapperboard"></i></div>
                  <div class="streak-card-details">
                    <p>Vault Count</p>
                    <p>${j} Movie(s)</p>
                  </div>`;
  card.appendChild(div);
}

function getHabitCount(j) {
  let card = document.querySelector("#habit-streak-contaienr");
  let div = document.createElement("div");
  div.id = "habit-count-card";
  div.classList.add("streak-card");
  div.innerHTML = `<div class="habit-card-icon"><i class="fas fa-dumbbell"></i></div>
                  <div class="streak-card-details">
                    <p>Habit Count</p>
                    <p>${j} Habit(s)</p>
                  </div>`;
  card.appendChild(div);
}

function getHabitCard(key, data) {
  let card = document.querySelector("#habit-container");
  let div = document.createElement("div");
  div.classList.add("habit-card");
  div.id = `${key}`;
  div.innerHTML = `
    <div class="habit-card-icon"><i class="fas fa-${data.keyIcon}"></i></div>
    <div class="habit-card-details">
      <p>${data.keyName}</p>
      <p><button class="btn" onclick="habitProgress(this)">${(data.keyStatus === "true")? '<i class="fas fa-check-double"></i>': '<i class="fas fa-check"></i>'}</button></p>
    </div>
  `;
  card.appendChild(div);
}

function getMovieCard(key, data) {
  let card = document.querySelector("#movie-container");
  let div = document.createElement("div");
  div.classList.add("movie-card");
  div.id = `${key}`;
  div.style.backgroundImage = `url(${data.Poster})`;
  card.appendChild(div);
}

function habitProgress(btn){
  let card = btn.parentElement.parentElement.parentElement;
  let data = JSON.parse(localStorage.getItem(card.id));
  if(data.keyStatus === "false"){
    btn.innerHTML = '<i class="fas fa-check-double"></i>';
    data.keyStatus = "true";
    localStorage.setItem(card.id, JSON.stringify(data));
    habitCompleteCount++;
    getProgress(habitCompleteCount, habitCount)
  } else {
    btn.innerHTML = '<i class="fas fa-check"></i>';
    data.keyStatus = "false";
    localStorage.setItem(card.id, JSON.stringify(data));
    habitCompleteCount--;
    getProgress(habitCompleteCount, habitCount)
  }
}