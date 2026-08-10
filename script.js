
document.addEventListener("DOMContentLoaded", function () {

    setupNavbar();
    setupAnimations();
    setupCounters();
    setupWeatherEnter();
    setupMarket();

});


/* =========================================================
   NAVBAR
========================================================= */

function setupNavbar() {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {

        hamburger.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });

    }

    const page =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav ul li a").forEach(function (link) {

        if (link.getAttribute("href") === page) {
            link.classList.add("active");
        }

    });

}


/* =========================================================
   ANIMATIONS
========================================================= */

function setupAnimations() {

    if (!("IntersectionObserver" in window)) return;

    const elements = document.querySelectorAll(".hidden");

    const observer = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }

        });

    }, { threshold: 0.1 });

    elements.forEach(function (element) {
        observer.observe(element);
    });

}


/* =========================================================
   COUNTERS
========================================================= */

function setupCounters() {

    const section = document.querySelector(".stats");

    if (!section) return;

    const counters = document.querySelectorAll(".counter");

    if (!counters.length) return;

    let started = false;

    function start() {

        if (started) return;

        started = true;

        counters.forEach(function (counter) {

            const target =
                Number(counter.getAttribute("data-target"));

            let current = 0;

            const step = target / 80;

            function update() {

                current += step;

                if (current >= target) {

                    counter.textContent = target + "+";

                    return;
                }

                counter.textContent = Math.ceil(current);

                requestAnimationFrame(update);

            }

            update();

        });

    }

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(function (entries) {

            if (entries[0].isIntersecting) {

                start();

                observer.disconnect();

            }

        }, { threshold: 0.3 });

        observer.observe(section);

    } else {

        start();

    }

}


/* =========================================================
   CROP ADVISOR
========================================================= */

function recommendCrop() {

    const soilElement = document.getElementById("soil");
    const seasonElement = document.getElementById("season");
    const tempElement = document.getElementById("temp");
    const rainElement = document.getElementById("rain");
    const result = document.getElementById("result");

    if (!soilElement || !seasonElement || !tempElement || !rainElement || !result) {
        return;
    }

    const soil = soilElement.value;
    const season = seasonElement.value;
    const temp = Number(tempElement.value);
    const rain = Number(rainElement.value);

    if (!soil || !season || isNaN(temp) || isNaN(rain)) {

        result.innerHTML =
            '<div class="alert alert-error">❌ Please fill all fields correctly.</div>';

        result.classList.add("visible");

        return;
    }

    let crop;
    let water;
    let fertilizer;

    if (soil === "black" && temp > 25 && rain < 100) {

        crop = "Cotton 🌿";
        water = "Moderate";
        fertilizer = "Nitrogen-rich";

    } else if (soil === "black" && season === "rainy") {

        crop = "Sorghum 🌾";
        water = "Moderate";
        fertilizer = "DAP + Urea";

    } else if (soil === "loamy" && temp < 20 && rain < 150) {

        crop = "Wheat 🌾";
        water = "Low–Moderate";
        fertilizer = "Phosphorus-based";

    } else if (soil === "loamy" && season === "summer") {

        crop = "Sunflower 🌻";
        water = "Moderate";
        fertilizer = "NPK 10-26-26";

    } else if (soil === "loamy" && season === "rainy") {

        crop = "Soybean 🫘";
        water = "Moderate";
        fertilizer = "Rhizobium + Phosphorus";

    } else if (soil === "sandy" && rain > 200) {

        crop = "Groundnut 🥜";
        water = "Low";
        fertilizer = "Organic compost";

    } else if (soil === "sandy" && season === "summer") {

        crop = "Watermelon 🍉";
        water = "Moderate";
        fertilizer = "Potassium-rich";

    } else if (rain > 200 && temp > 22) {

        crop = "Rice 🍚";
        water = "High";
        fertilizer = "Nitrogen + Potassium";

    } else if (rain > 150 && temp > 18 && season === "rainy") {

        crop = "Maize 🌽";
        water = "Moderate–High";
        fertilizer = "Balanced NPK";

    } else if (temp < 18 && season === "winter") {

        crop = "Mustard 🌿";
        water = "Low";
        fertilizer = "Sulphur + Nitrogen";

    } else {

        crop = "Maize 🌽";
        water = "Moderate";
        fertilizer = "Balanced NPK";

    }

    result.innerHTML = `
        <h3>🌱 Recommended: ${crop}</h3>
        <p>🌡 Temperature: <strong>${temp}°C</strong></p>
        <p>🌧 Rainfall: <strong>${rain} mm</strong></p>
        <p>🌍 Soil: <strong>${capitalize(soil)}</strong></p>
        <p>💧 Water Needs: <strong>${water}</strong></p>
        <p>🧪 Fertilizer: <strong>${fertilizer}</strong></p>
    `;

    result.classList.add("visible");

}


/* =========================================================
   WEATHER
========================================================= */

function getWeather() {

    const cityElement = document.getElementById("city");
    const result = document.getElementById("weather-result");

    if (!cityElement || !result) return;

    const city = cityElement.value.trim();

    if (!city) {

        result.innerHTML =
            '<div class="alert alert-error">❌ Please enter a city name.</div>';

        return;
    }

    const apiKey =
        "43eb946a4a4e98f4bd563a52f20c6bb2";

    const url =
        "https://api.openweathermap.org/data/2.5/weather" +
        "?q=" + encodeURIComponent(city) +
        "&appid=" + apiKey +
        "&units=metric";

    result.innerHTML =
        "<p>⏳ Fetching weather...</p>";

    fetch(url)

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {

            if (data.cod === 404 || data.cod === "404") {

                result.innerHTML =
                    '<div class="alert alert-error">❌ City not found.</div>';

                return;
            }

            if (!data.main || !data.weather) {

                result.innerHTML =
                    '<div class="alert alert-error">⚠️ Weather data unavailable.</div>';

                return;
            }

            const temp = data.main.temp;
            const feels = data.main.feels_like;
            const humidity = data.main.humidity;
            const condition = data.weather[0].description;
            const icon = data.weather[0].icon;
            const wind = data.wind ? data.wind.speed : 0;

            result.innerHTML = `
                <img
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="Weather"
                >

                <h2>${escapeHTML(data.name)}, ${escapeHTML(data.sys.country)}</h2>

                <p>🌡 Temperature:
                    <strong>${temp}°C</strong>
                </p>

                <p>🌡 Feels like:
                    <strong>${feels}°C</strong>
                </p>

                <p>💧 Humidity:
                    <strong>${humidity}%</strong>
                </p>

                <p>💨 Wind:
                    <strong>${wind} m/s</strong>
                </p>

                <p>⛅ ${capitalize(condition)}</p>
            `;

        })

        .catch(function () {

            result.innerHTML =
                '<div class="alert alert-error">⚠️ Could not reach weather service.</div>';

        });

}


function setupWeatherEnter() {

    const city = document.getElementById("city");

    if (!city) return;

    city.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {
            getWeather();
        }

    });

}


/* =========================================================
   MARKET API
========================================================= */

const MARKET_API_KEY =
    "579b464db66ec23bdd000001f0a6d4e1d4a1408f426dc5f3574c0340";

const MARKET_RESOURCE =
    "9ef84268-d588-465a-a308-a864a43d0070";

const MARKET_URL =
    "https://api.data.gov.in/resource/" +
    MARKET_RESOURCE;


/* =========================================================
   MAJOR CROPS
========================================================= */

const MAJOR_CROPS = [

    {
        name: "Wheat",
        emoji: "🌾",
        keywords: ["wheat"]
    },

    {
        name: "Rice",
        emoji: "🍚",
        keywords: ["rice"]
    },

    {
        name: "Paddy",
        emoji: "🌾",
        keywords: ["paddy", "dhan"]
    },

    {
        name: "Maize",
        emoji: "🌽",
        keywords: ["maize", "corn"]
    },

    {
        name: "Potato",
        emoji: "🥔",
        keywords: ["potato"]
    },

    {
        name: "Onion",
        emoji: "🧅",
        keywords: ["onion"]
    },

    {
        name: "Tomato",
        emoji: "🍅",
        keywords: ["tomato"]
    },

    {
        name: "Cotton",
        emoji: "🌱",
        keywords: ["cotton"]
    },

    {
        name: "Mustard",
        emoji: "🌿",
        keywords: ["mustard", "sarson"]
    },

    {
        name: "Soybean",
        emoji: "🫘",
        keywords: ["soybean", "soya"]
    },

    {
        name: "Sugarcane",
        emoji: "🌱",
        keywords: ["sugarcane"]
    },

    {
        name: "Chilli",
        emoji: "🌶️",
        keywords: ["chilli", "chili"]
    },

    {
        name: "Gram / Chana",
        emoji: "🫘",
        keywords: ["gram", "chana"]
    },

    {
        name: "Groundnut",
        emoji: "🥜",
        keywords: ["groundnut", "peanut"]
    },

    {
        name: "Bajra",
        emoji: "🌾",
        keywords: ["bajra", "pearl millet"]
    },

    {
        name: "Jowar",
        emoji: "🌾",
        keywords: ["jowar", "sorghum"]
    }

];


/* =========================================================
   STATES
========================================================= */

const INDIAN_STATES = [

    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"

];


/* =========================================================
   MARKET INITIALIZATION
========================================================= */

function setupMarket() {

    const state = document.getElementById("state");

    if (!state) return;

    console.log("AgroBrains Market initialized.");

    /*
       IMPORTANT:
       States are added locally first.
       Therefore the dropdown works even
       before the API is contacted.
    */

    state.innerHTML =
        '<option value="">Select State / UT</option>';

    INDIAN_STATES.forEach(function (stateName) {

        const option =
            document.createElement("option");

        option.value = stateName;
        option.textContent = stateName;

        state.appendChild(option);

    });


    resetDropdown(
        document.getElementById("district"),
        "Select District"
    );

    resetDropdown(
        document.getElementById("market"),
        "Select Mandi"
    );

    resetDropdown(
        document.getElementById("commodity"),
        "Select Commodity"
    );


    state.addEventListener(
        "change",
        loadDistricts
    );


    const district =
        document.getElementById("district");

    if (district) {

        district.addEventListener(
            "change",
            loadMarkets
        );

    }


    const market =
        document.getElementById("market");

    if (market) {

        market.addEventListener(
            "change",
            loadCommodities
        );

    }


    const commodity =
        document.getElementById("commodity");

    if (commodity) {

        commodity.addEventListener(
            "change",
            updateMarketButtons
        );

    }


    setMarketStatus(
        "Select a state to begin."
    );

}


/* =========================================================
   FETCH MARKET DATA
========================================================= */

async function fetchMarketData(filters, limit) {

    const params =
        new URLSearchParams();

    params.set(
        "api-key",
        MARKET_API_KEY
    );

    params.set(
        "format",
        "json"
    );

    params.set(
        "limit",
        String(limit || 10000)
    );


    Object.keys(filters).forEach(function (key) {

        if (filters[key]) {

            params.set(
                "filters[" + key + "]",
                filters[key]
            );

        }

    });


    const response =
        await fetch(
            MARKET_URL + "?" + params.toString()
        );


    if (!response.ok) {

        throw new Error(
            "API error: " + response.status
        );

    }


    const data =
        await response.json();


    return Array.isArray(data.records)
        ? data.records
        : [];

}


/* =========================================================
   LOAD DISTRICTS
========================================================= */

async function loadDistricts() {

    const state =
        document.getElementById("state").value;

    const district =
        document.getElementById("district");

    const market =
        document.getElementById("market");

    const commodity =
        document.getElementById("commodity");


    resetDropdown(
        district,
        "Loading Districts..."
    );

    resetDropdown(
        market,
        "Select Mandi"
    );

    resetDropdown(
        commodity,
        "Select Commodity"
    );


    if (!state) {

        resetDropdown(
            district,
            "Select District"
        );

        setMarketStatus(
            "Select a state to begin."
        );

        return;
    }


    setMarketStatus(
        "⏳ Loading districts..."
    );


    try {

        const records =
            await fetchMarketData(
                {
                    state: state
                },
                10000
            );


        const districts =
            getUnique(
                records,
                "district"
            );


        fillDropdown(
            district,
            districts,
            "Select District"
        );


        if (districts.length) {

            setMarketStatus(
                districts.length +
                " districts found in " +
                state + "."
            );

        } else {

            setMarketStatus(
                "No district data found for this state.",
                "error"
            );

        }

    } catch (error) {

        console.error(
            "District API error:",
            error
        );

        resetDropdown(
            district,
            "Could not load districts"
        );

        setMarketStatus(
            "⚠️ Could not load districts.",
            "error"
        );

    }

}


/* =========================================================
   LOAD MANDIS
========================================================= */

async function loadMarkets() {

    const state =
        document.getElementById("state").value;

    const district =
        document.getElementById("district").value;

    const market =
        document.getElementById("market");

    const commodity =
        document.getElementById("commodity");


    resetDropdown(
        market,
        "Loading Mandis..."
    );

    resetDropdown(
        commodity,
        "Select Commodity"
    );


    if (!state || !district) return;


    setMarketStatus(
        "⏳ Loading mandis..."
    );


    try {

        const records =
            await fetchMarketData(
                {
                    state: state,
                    district: district
                },
                10000
            );


        const markets =
            getUnique(
                records,
                "market"
            );


        fillDropdown(
            market,
            markets,
            "Select Mandi"
        );


        if (markets.length) {

            setMarketStatus(
                markets.length +
                " mandis found."
            );

        } else {

            setMarketStatus(
                "No mandi data found.",
                "error"
            );

        }

    } catch (error) {

        console.error(
            "Mandi API error:",
            error
        );

        resetDropdown(
            market,
            "Could not load mandis"
        );

        setMarketStatus(
            "⚠️ Could not load mandis.",
            "error"
        );

    }

}


/* =========================================================
   LOAD COMMODITIES
========================================================= */

async function loadCommodities() {

    const state =
        document.getElementById("state").value;

    const district =
        document.getElementById("district").value;

    const market =
        document.getElementById("market").value;

    const commodity =
        document.getElementById("commodity");


    resetDropdown(
        commodity,
        "Loading Commodities..."
    );


    if (!state || !district || !market) return;


    setMarketStatus(
        "⏳ Loading commodities..."
    );


    try {

        const records =
            await fetchMarketData(
                {
                    state: state,
                    district: district,
                    market: market
                },
                10000
            );


        const commodities =
            getUnique(
                records,
                "commodity"
            );


        if (!commodities.length) {

            resetDropdown(
                commodity,
                "No commodities found"
            );

            setMarketStatus(
                "No commodities found for this mandi.",
                "error"
            );

            return;

        }


        buildCommodityDropdown(
            commodity,
            commodities
        );


        setMarketStatus(
            commodities.length +
            " commodities available."
        );


        updateMarketButtons();

    } catch (error) {

        console.error(
            "Commodity API error:",
            error
        );

        resetDropdown(
            commodity,
            "Could not load commodities"
        );

        setMarketStatus(
            "⚠️ Could not load commodities.",
            "error"
        );

    }

}


/* =========================================================
   COMMODITY DROPDOWN
========================================================= */

function buildCommodityDropdown(
    select,
    commodities
) {

    select.innerHTML =
        '<option value="">Select Commodity</option>';


    const majorGroup =
        document.createElement("optgroup");

    majorGroup.label =
        "⭐ Major Crops";


    const otherGroup =
        document.createElement("optgroup");

    otherGroup.label =
        "Other Commodities";


    const used =
        new Set();


    MAJOR_CROPS.forEach(function (crop) {

        const match =
            commodities.find(function (commodity) {

                return crop.keywords.some(function (keyword) {

                    return commodity
                        .toLowerCase()
                        .includes(
                            keyword.toLowerCase()
                        );

                });

            });


        if (!match) return;


        const option =
            document.createElement("option");

        option.value = match;

        option.textContent =
            crop.emoji + " " + crop.name;


        majorGroup.appendChild(option);

        used.add(match);

    });


    commodities.forEach(function (name) {

        if (used.has(name)) return;


        const option =
            document.createElement("option");

        option.value = name;

        option.textContent = name;

        otherGroup.appendChild(option);

    });


    if (majorGroup.children.length) {

        select.appendChild(
            majorGroup
        );

    }


    if (otherGroup.children.length) {

        select.appendChild(
            otherGroup
        );

    }


    select.disabled = false;

}


/* =========================================================
   GET UNIQUE VALUES
========================================================= */

function getUnique(
    records,
    field
) {

    return [
        ...new Set(

            records
                .map(function (record) {

                    return String(
                        record[field] || ""
                    ).trim();

                })
                .filter(Boolean)

        )

    ].sort(function (a, b) {

        return a.localeCompare(b);

    });

}


/* =========================================================
   DROPDOWN HELPERS
========================================================= */

function resetDropdown(
    select,
    text
) {

    if (!select) return;

    select.innerHTML =
        '<option value="">' +
        text +
        '</option>';

    select.disabled = true;

}


function fillDropdown(
    select,
    values,
    placeholder
) {

    if (!select) return;

    select.innerHTML =
        '<option value="">' +
        placeholder +
        '</option>';


    values.forEach(function (value) {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        select.appendChild(option);

    });


    select.disabled =
        values.length === 0;

}


/* =========================================================
   MARKET STATUS
========================================================= */

function setMarketStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "market-status"
        );

    if (!status) return;

    status.textContent =
        message;

    status.className =
        "market-status";

    if (type) {

        status.classList.add(
            type
        );

    }

}


/* =========================================================
   MARKET BUTTONS
========================================================= */

function updateMarketButtons() {

    const state =
        document.getElementById("state")?.value;

    const district =
        document.getElementById("district")?.value;

    const market =
        document.getElementById("market")?.value;

    const commodity =
        document.getElementById("commodity")?.value;


    const searchButton =
        document.getElementById(
            "market-search-btn"
        );

    const compareButton =
        document.getElementById(
            "compare-btn"
        );


    if (searchButton) {

        searchButton.disabled =
            !(
                state &&
                district &&
                market &&
                commodity
            );

    }


    if (compareButton) {

        compareButton.disabled =
            !(
                state &&
                district &&
                market
            );

    }

}


/* =========================================================
   GET SELECTED CROP PRICE
========================================================= */

async function loadMarketPrices() {

    const state =
        document.getElementById("state")?.value;

    const district =
        document.getElementById("district")?.value;

    const market =
        document.getElementById("market")?.value;

    const commodity =
        document.getElementById("commodity")?.value;


    /*
       Compatibility with old Market page.
    */

    if (!commodity) {

        if (
            document.getElementById("wheat") &&
            document.getElementById("rice")
        ) {

            return loadOldMarketPrices();

        }

    }


    if (!state || !district || !market || !commodity) {

        setMarketStatus(
            "Please select State, District, Mandi and Commodity.",
            "error"
        );

        return;

    }


    setMarketStatus(
        "⏳ Loading price..."
    );


    try {

        const records =
            await fetchMarketData(
                {
                    state: state,
                    district: district,
                    market: market,
                    commodity: commodity
                },
                1000
            );


        renderPriceTable(
            records
        );


        if (records.length) {

            setMarketStatus(
                records.length +
                " price record(s) found."
            );

        } else {

            setMarketStatus(
                "No price data found for this crop.",
                "error"
            );

        }

    } catch (error) {

        console.error(
            "Price API error:",
            error
        );

        setMarketStatus(
            "⚠️ Could not load price data.",
            "error"
        );

    }

}


/* =========================================================
   PRICE TABLE
========================================================= */

function renderPriceTable(
    records
) {

    const body =
        document.getElementById(
            "market-body"
        );

    if (!body) return;


    if (!records.length) {

        body.innerHTML = `
            <tr>
                <td colspan="7">
                    No price data available.
                </td>
            </tr>
        `;

        clearSelected();

        return;
    }


    body.innerHTML =
        records.map(function (item) {

            return `
                <tr>

                    <td>
                        ${escapeHTML(item.commodity || "—")}
                    </td>

                    <td>
                        ${escapeHTML(item.variety || "—")}
                    </td>

                    <td>
                        ${escapeHTML(item.market || "—")}
                    </td>

                    <td>
                        ${formatPrice(item.min_price)}
                    </td>

                    <td>
                        ${formatPrice(item.max_price)}
                    </td>

                    <td class="price-val">
                        ${formatPrice(item.modal_price)}
                    </td>

                    <td>
                        ${escapeHTML(item.arrival_date || "—")}
                    </td>

                </tr>
            `;

        }).join("");


    const selected =
        records.find(function (item) {

            return Number(item.modal_price) > 0;

        }) || records[0];


    updateSelected(
        selected
    );


    const time =
        document.getElementById(
            "update-time"
        );

    if (time) {

        time.textContent =
            "Last updated: " +
            new Date().toLocaleString();

    }

}


/* =========================================================
   SELECTED CROP CARD
========================================================= */

function updateSelected(
    item
) {

    if (!item) return;


    const commodity =
        document.getElementById(
            "selected-commodity"
        );

    const min =
        document.getElementById(
            "selected-min"
        );

    const max =
        document.getElementById(
            "selected-max"
        );

    const modal =
        document.getElementById(
            "selected-modal"
        );


    if (commodity) {

        commodity.textContent =
            item.commodity || "—";

    }

    if (min) {

        min.textContent =
            formatPrice(item.min_price);

    }

    if (max) {

        max.textContent =
            formatPrice(item.max_price);

    }

    if (modal) {

        modal.textContent =
            formatPrice(item.modal_price);

    }

}


function clearSelected() {

    [
        "selected-commodity",
        "selected-min",
        "selected-max",
        "selected-modal"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = "—";
        }

    });

}


/* =========================================================
   COMPARE MAJOR CROPS
========================================================= */

async function compareMajorCrops() {

    const state =
        document.getElementById("state")?.value;

    const district =
        document.getElementById("district")?.value;

    const market =
        document.getElementById("market")?.value;


    if (!state || !district || !market) {

        setMarketStatus(
            "Please select State, District and Mandi first.",
            "error"
        );

        return;
    }


    setMarketStatus(
        "⏳ Comparing major crops..."
    );


    try {

        const records =
            await fetchMarketData(
                {
                    state: state,
                    district: district,
                    market: market
                },
                10000
            );


        const prices = {};


        records.forEach(function (item) {

            const commodity =
                String(
                    item.commodity || ""
                ).toLowerCase();


            const price =
                Number(
                    item.modal_price
                );


            if (!commodity || !price || price <= 0) {
                return;
            }


            const crop =
                MAJOR_CROPS.find(function (major) {

                    return major.keywords.some(function (keyword) {

                        return commodity.includes(
                            keyword.toLowerCase()
                        );

                    });

                });


            if (!crop) return;


            if (
                !prices[crop.name] ||
                price > prices[crop.name]
            ) {

                prices[crop.name] =
                    price;

            }

        });


        const labels =
            Object.keys(prices);


        const values =
            labels.map(function (label) {
                return prices[label];
            });


        if (!labels.length) {

            setMarketStatus(
                "No major crop prices found for this mandi.",
                "error"
            );

            return;
        }


        drawComparisonChart(
            labels,
            values
        );


        setMarketStatus(
            "📊 Comparing " +
            labels.length +
            " major crops."
        );


    } catch (error) {

        console.error(
            "Comparison error:",
            error
        );

        setMarketStatus(
            "⚠️ Could not compare crop prices.",
            "error"
        );

    }

}


/* =========================================================
   CHART
========================================================= */

let marketChart = null;


function drawComparisonChart(
    labels,
    values
) {

    const canvas =
        document.getElementById(
            "priceChart"
        );


    if (!canvas) return;


    if (typeof Chart === "undefined") {

        console.error(
            "Chart.js is not loaded."
        );

        return;
    }


    if (marketChart) {

        marketChart.destroy();

    }


    marketChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            label:
                                "Modal Price (₹/Quintal)",

                            data: values,

                            borderRadius: 6

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (value) {

                                        return "₹" +
                                            Number(value)
                                                .toLocaleString("en-IN");

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================================
   OLD MARKET PAGE COMPATIBILITY
========================================================= */

function loadOldMarketPrices() {

    const state =
        document.getElementById("state")?.value || "";

    const district =
        document.getElementById("district")?.value || "";


    fetchMarketData(
        {
            state: state,
            district: district
        },
        1000
    )

    .then(function (records) {

        let wheat = 0;
        let rice = 0;
        let cotton = 0;
        let maize = 0;


        records.forEach(function (item) {

            const crop =
                String(
                    item.commodity || ""
                ).toLowerCase();

            const price =
                Number(
                    item.modal_price
                );


            if (!price) return;


            if (
                crop.includes("wheat") &&
                !wheat
            ) {
                wheat = price;
            }


            if (
                (crop.includes("rice") ||
                 crop.includes("paddy")) &&
                !rice
            ) {
                rice = price;
            }


            if (
                crop.includes("cotton") &&
                !cotton
            ) {
                cotton = price;
            }


            if (
                crop.includes("maize") &&
                !maize
            ) {
                maize = price;
            }

        });


        setText(
            "wheat",
            formatPrice(wheat)
        );

        setText(
            "rice",
            formatPrice(rice)
        );

        setText(
            "cotton",
            formatPrice(cotton)
        );

        setText(
            "maize",
            formatPrice(maize)
        );


        const canvas =
            document.getElementById(
                "priceChart"
            );


        if (
            canvas &&
            typeof Chart !== "undefined"
        ) {

            drawComparisonChart(
                [
                    "Wheat 🌾",
                    "Rice 🍚",
                    "Cotton 🌱",
                    "Maize 🌽"
                ],
                [
                    wheat,
                    rice,
                    cotton,
                    maize
                ]
            );

        }


        setText(
            "update-time",
            "Last updated: " +
            new Date().toLocaleString()
        );

    })

    .catch(function (error) {

        console.error(
            error
        );

        setText(
            "update-time",
            "⚠️ Could not load market prices."
        );

    });

}


/* =========================================================
   UTILITY FUNCTIONS
========================================================= */

function formatPrice(value) {

    const number =
        Number(value);

    if (
        !isNaN(number) &&
        number > 0
    ) {

        return "₹ " +
            number.toLocaleString(
                "en-IN"
            );

    }

    return "—";

}


function setText(
    id,
    text
) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = text;
    }

}


function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


function escapeHTML(text) {

    return String(text)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   CONTACT FORM
========================================================= */

function submitForm(event) {

    event.preventDefault();


    const name =
        document.getElementById("name")?.value.trim();

    const email =
        document.getElementById("email")?.value.trim();

    const message =
        document.getElementById("message")?.value.trim();

    const output =
        document.getElementById("form-msg");


    if (!output) return;


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

        output.innerHTML =
            '<div class="alert alert-error">' +
            '❌ Please enter a valid email address.' +
            '</div>';

        return;
    }


    output.innerHTML = `
        <div class="alert alert-success">
            ✅ Thank you, ${escapeHTML(name)}!
            Your message has been received.
            We'll get back to you at
            ${escapeHTML(email)}.
        </div>
    `;


    event.target.reset();

}
/* =========================================================
   5-DAY WEATHER FORECAST
========================================================= */

function showCurrentWeather() {

    const currentButton =
        document.getElementById("current-weather-btn");

    const forecastButton =
        document.getElementById("forecast-btn");

    const weatherResult =
        document.getElementById("weather-result");

    const forecastResult =
        document.getElementById("forecast-result");


    if (weatherResult) {
        weatherResult.style.display = "block";
    }

    if (forecastResult) {
        forecastResult.style.display = "none";
    }


    if (currentButton) {
        currentButton.classList.add("active");
    }

    if (forecastButton) {
        forecastButton.classList.remove("active");
    }

}


/* =========================================================
   GET 5-DAY FORECAST
========================================================= */

function getForecast() {

    const cityElement =
        document.getElementById("city");

    const weatherResult =
        document.getElementById("weather-result");

    const forecastResult =
        document.getElementById("forecast-result");

    const currentButton =
        document.getElementById("current-weather-btn");

    const forecastButton =
        document.getElementById("forecast-btn");


    if (!cityElement || !forecastResult) {
        return;
    }


    const city =
        cityElement.value.trim();


    if (!city) {

        if (weatherResult) {

            weatherResult.style.display = "block";

            weatherResult.innerHTML =
                '<div class="alert alert-error">' +
                '❌ Please enter a city name first.' +
                '</div>';

        }

        return;
    }


    if (weatherResult) {
        weatherResult.style.display = "none";
    }


    forecastResult.style.display = "block";


    if (currentButton) {
        currentButton.classList.remove("active");
    }

    if (forecastButton) {
        forecastButton.classList.add("active");
    }


    forecastResult.innerHTML = `
        <div class="forecast-loading">
            <p>⏳ Loading 5-day forecast for ${escapeHTML(city)}...</p>
        </div>
    `;


    const apiKey =
        "43eb946a4a4e98f4bd563a52f20c6bb2";


    const url =
        "https://api.openweathermap.org/data/2.5/forecast" +
        "?q=" + encodeURIComponent(city) +
        "&appid=" + apiKey +
        "&units=metric";


    fetch(url)

        .then(function (response) {

            return response.json();

        })

        .then(function (data) {

            if (
                data.cod === 404 ||
                data.cod === "404"
            ) {

                forecastResult.innerHTML = `
                    <div class="alert alert-error">
                        ❌ City not found.
                        Please check the city name.
                    </div>
                `;

                return;
            }


            if (
                data.cod !== 200 &&
                data.cod !== "200"
            ) {

                forecastResult.innerHTML = `
                    <div class="alert alert-error">
                        ⚠️ Unable to get forecast data.
                    </div>
                `;

                return;
            }


            if (
                !data.list ||
                !data.list.length
            ) {

                forecastResult.innerHTML = `
                    <div class="alert alert-error">
                        ⚠️ No forecast data available.
                    </div>
                `;

                return;
            }


            const dailyData =
                createDailyForecast(
                    data.list
                );


            renderFiveDayForecast(
                dailyData,
                data.city
            );

        })

        .catch(function (error) {

            console.error(
                "Forecast error:",
                error
            );


            forecastResult.innerHTML = `
                <div class="alert alert-error">
                    ⚠️ Could not reach weather service.
                    Please check your internet connection.
                </div>
            `;

        });

}


/* =========================================================
   CREATE DAILY FORECAST
========================================================= */

function createDailyForecast(
    forecastList
) {

    const days = {};


    forecastList.forEach(function (item) {

        const date =
            new Date(item.dt * 1000);


        const dateKey =
            date.toISOString().split("T")[0];


        if (!days[dateKey]) {

            days[dateKey] = {

                date: date,

                temperatures: [],

                weather: [],

                humidity: [],

                wind: [],

                rainProbability: []

            };

        }


        days[dateKey].temperatures.push(
            Number(item.main.temp)
        );


        days[dateKey].weather.push(
            item.weather[0]
        );


        days[dateKey].humidity.push(
            Number(item.main.humidity)
        );


        days[dateKey].wind.push(
            Number(item.wind.speed)
        );


        if (
            typeof item.pop === "number"
        ) {

            days[dateKey].rainProbability.push(
                Number(item.pop)
            );

        }

    });


    const result =
        Object.values(days);


    /*
       The API can return the current
       partial day plus the next days.

       We take the next 5 calendar days.
    */

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    const forecastDays =
        result.filter(function (day) {

            const dayDate =
                new Date(day.date);

            dayDate.setHours(
                0,
                0,
                0,
                0
            );

            return dayDate >= tomorrow;

        });


    return forecastDays.slice(0, 5);

}


/* =========================================================
   RENDER 5-DAY FORECAST
========================================================= */

function renderFiveDayForecast(
    days,
    cityData
) {

    const forecastResult =
        document.getElementById(
            "forecast-result"
        );


    if (!forecastResult) {
        return;
    }


    if (!days.length) {

        forecastResult.innerHTML = `
            <div class="alert alert-error">
                ⚠️ 5-day forecast is not available
                for this location.
            </div>
        `;

        return;
    }


    const cityName =
        cityData && cityData.name
            ? cityData.name
            : "Selected City";


    const country =
        cityData && cityData.country
            ? cityData.country
            : "";


    let html = `

        <div class="forecast-title">

            <h2>
                📅 5-Day Forecast
            </h2>

            <p>
                ${escapeHTML(cityName)}
                ${country ? ", " + escapeHTML(country) : ""}
            </p>

        </div>

        <div class="forecast-container">
    `;


    days.forEach(function (day) {

        const temperatures =
            day.temperatures;


        const maxTemp =
            Math.max(...temperatures);


        const minTemp =
            Math.min(...temperatures);


        /*
           Find the most common weather
           condition during the day.
        */

        const weatherCounts = {};


        day.weather.forEach(function (weather) {

            const key =
                weather.main;

            weatherCounts[key] =
                (weatherCounts[key] || 0) + 1;

        });


        let dominantWeather =
            day.weather[0];


        let highestCount = 0;


        day.weather.forEach(function (weather) {

            const count =
                weatherCounts[weather.main];


            if (count > highestCount) {

                highestCount =
                    count;

                dominantWeather =
                    weather;

            }

        });


        const icon =
            dominantWeather.icon;


        const condition =
            dominantWeather.description;


        const humidity =
            Math.round(
                average(day.humidity)
            );


        const wind =
            average(day.wind);


        const rainProbability =
            day.rainProbability.length

                ? Math.round(
                    Math.max(
                        ...day.rainProbability
                    ) * 100
                )

                : 0;


        const dayName =
            day.date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const dateText =
            day.date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short"
                }
            );


        html += `

            <div class="forecast-card">

                <div class="forecast-day">
                    ${dayName}
                </div>

                <div class="forecast-date">
                    ${dateText}
                </div>

                <img
                    class="forecast-icon"
                    src="https://openweathermap.org/img/wn/${icon}@2x.png"
                    alt="${escapeHTML(condition)}"
                >

                <div class="forecast-temp">
                    ${Math.round(maxTemp)}°C
                    /
                    ${Math.round(minTemp)}°C
                </div>

                <div class="forecast-condition">
                    ${escapeHTML(condition)}
                </div>

                <div class="forecast-details">

                    💧 Humidity:
                    ${humidity}%

                    <br>

                    🌧️ Rain:
                    ${rainProbability}%

                    <br>

                    💨 Wind:
                    ${wind.toFixed(1)} m/s

                </div>

            </div>

        `;

    });


    html += `
        </div>
    `;


    forecastResult.innerHTML =
        html;

}


/* =========================================================
   AVERAGE
========================================================= */

function average(
    numbers
) {

    if (
        !numbers ||
        !numbers.length
    ) {

        return 0;

    }


    const total =
        numbers.reduce(
            function (sum, value) {

                return sum + value;

            },
            0
        );


    return total / numbers.length;

}


/* =========================================================
   ENTER KEY
   Current Weather remains the default action.
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const cityInput =
            document.getElementById("city");


        if (!cityInput) {
            return;
        }


        cityInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter"
                ) {

                    getWeather();

                }

            }
        );

    }
);
