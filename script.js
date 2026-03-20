// =====================================
// CROP RECOMMENDATION FUNCTION
// =====================================

/* =====================================
   CROP RECOMMENDATION
=====================================*/

function recommendCrop(){

let soil = document.getElementById("soil").value;
let season = document.getElementById("season").value;
let temp = document.getElementById("temp").value;
let rain = document.getElementById("rain").value;
let result = document.getElementById("result");

if(!soil || !season || !temp || !rain){
result.innerHTML = "❌ Please fill all fields";
return;
}

let crop = "";
let water = "";
let fertilizer = "";


/* Smart Logic */

if(soil === "black" && temp > 25 && rain < 100){
crop = "Cotton 🌿";
water = "Moderate water required";
fertilizer = "Nitrogen-rich fertilizer";
}

else if(soil === "loamy" && temp < 20 && rain < 150){
crop = "Wheat 🌾";
water = "Low to moderate water";
fertilizer = "Phosphorus fertilizer";
}

else if(soil === "sandy" && rain > 200){
crop = "Groundnut 🌰";
water = "Low water required";
fertilizer = "Organic compost";
}

else if(rain > 200 && temp > 20){
crop = "Rice 🍚";
water = "High water required";
fertilizer = "Nitrogen + Potassium";
}

else{
crop = "Maize 🌽";
water = "Moderate water";
fertilizer = "Balanced fertilizer (NPK)";
}


/* Output */

result.innerHTML = `
<h3>🌱 Recommended Crop: ${crop}</h3>
<p>🌡 Temperature: ${temp}°C</p>
<p>🌧 Rainfall: ${rain} mm</p>
<p>💧 Water: ${water}</p>
<p>🧪 Fertilizer: ${fertilizer}</p>
`;

}

/* =====================================
   WEATHER API
=====================================*/

function getWeather() {

    let city = document.getElementById("city").value;
    let result = document.getElementById("weather-result");

    let apiKey = "43eb946a4a4e98f4bd563a52f20c6bb2";

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    result.innerHTML = "Loading weather...";

    fetch(url)
    .then(response => response.json())
    .then(data => {

        if(data.cod == "404"){
            result.innerHTML = "❌ City not found";
            return;
        }

        let temp = data.main.temp;
        let humidity = data.main.humidity;
        let condition = data.weather[0].main;
        let icon = data.weather[0].icon;

        let iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        result.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${iconUrl}">
        <p>🌡 Temperature: ${temp}°C</p>
        <p>💧 Humidity: ${humidity}%</p>
        <p>⛅ Condition: ${condition}</p>
        `;

        if(condition == "Clear"){
            document.body.style.background = "#87CEEB";
        }
        else if(condition == "Clouds"){
            document.body.style.background = "#B0C4DE";
        }
        else if(condition == "Rain"){
            document.body.style.background = "#5F9EA0";
        }
        else{
            document.body.style.background = "#f4f4f4";
        }

    })
    .catch(() => {
        result.innerHTML = "⚠️ Error fetching weather";
    });

}


/* =====================================
   PAGE LOAD FEATURES
=====================================*/

document.addEventListener("DOMContentLoaded", function () {

    /* MOBILE NAVBAR */

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    /* SCROLL ANIMATION */

    const hiddenElements = document.querySelectorAll(".hidden");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    });

    hiddenElements.forEach((el) => observer.observe(el));

    /* COUNTER ANIMATION */

    const statsSection = document.querySelector(".stats");
    const counters = document.querySelectorAll(".counter");

    let counterStarted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {

            if (entry.isIntersecting && !counterStarted) {

                counters.forEach(counter => {

                    const updateCounter = () => {

                        const target = +counter.getAttribute("data-target");
                        const current = +counter.innerText;
                        const increment = target / 100;

                        if (current < target) {
                            counter.innerText = Math.ceil(current + increment);
                            setTimeout(updateCounter, 20);
                        }
                        else {
                            counter.innerText = target + "+";
                        }

                    };

                    updateCounter();
                });

                counterStarted = true;
            }

        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

});
/* ================================
   CHART VARIABLE (GLOBAL)
================================ */

let chart;


/* ================================
   DRAW CHART FUNCTION
================================ */

function drawChart(wheat, rice, cotton, maize){

const ctx = document.getElementById("priceChart").getContext("2d");

if(chart){
chart.destroy();
}

chart = new Chart(ctx, {
type: "bar",
data: {
labels: ["Wheat 🌾", "Rice 🍚", "Cotton 🌿", "Maize 🌽"],
datasets: [{
label: "Market Price (₹)",
data: [wheat, rice, cotton, maize],
backgroundColor: [
"#4CAF50",
"#2196F3",
"#FF9800",
"#9C27B0"
]
}]
},
options: {
responsive: true,
plugins: {
legend: {
display: true
}
}
}
});

}


/* ================================
   LOAD MARKET PRICES
================================ */

function loadMarketPrices(){

let apiKey = "579b464db66ec23bdd000001f0a6d4e1d4a1408f426dc5f3574c0340";

let state = document.getElementById("state").value;
let district = document.getElementById("district").value;

let url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key="
+ apiKey +
"&format=json&limit=200";

if(state !== ""){
url += "&filters[state]=" + state;
}

if(district !== ""){
url += "&filters[district]=" + district;
}

fetch(url)
.then(response => response.json())
.then(data => {

let records = data.records;

let wheat="--";
let rice="--";
let cotton="--";
let maize="--";

records.forEach(function(item){

let crop = item.commodity;

if(crop && crop.includes("Wheat") && wheat==="--"){
wheat = item.modal_price;
}

if(crop && (crop.includes("Rice") || crop.includes("Paddy")) && rice==="--"){
rice = item.modal_price;
}

if(crop && crop.includes("Cotton") && cotton==="--"){
cotton = item.modal_price;
}

if(crop && crop.includes("Maize") && maize==="--"){
maize = item.modal_price;
}

});


/* Update table */
document.getElementById("wheat").innerHTML = "₹ " + wheat;
document.getElementById("rice").innerHTML = "₹ " + rice;
document.getElementById("cotton").innerHTML = "₹ " + cotton;
document.getElementById("maize").innerHTML = "₹ " + maize;


/* Draw Chart */
drawChart(
Number(wheat) || 0,
Number(rice) || 0,
Number(cotton) || 0,
Number(maize) || 0
);


/* Update time */
let now = new Date();
document.getElementById("update-time").innerHTML =
"Last Updated: " + now.toLocaleTimeString();

})
.catch(error => {
console.log("API Error:", error);
});

}


/* ================================
   LOAD WHEN PAGE STARTS
================================ */

document.addEventListener("DOMContentLoaded", function(){
loadMarketPrices();
});

function submitForm(event){
event.preventDefault();

let name = document.getElementById("name").value;

document.getElementById("form-msg").innerHTML =
"✅ Thank you " + name + "! Your message has been received.";

}