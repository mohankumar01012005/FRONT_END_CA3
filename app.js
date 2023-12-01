const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const food = document.getElementById('food');
const randomFood = document.getElementById('randomfood');
const ingredients_div = document.getElementById('ingredients');
const ingredients_blur_div = document.getElementById('ingredients_blur_div');
const temp = document.getElementById('temp');
const rsultss = document.getElementById('popularSearch');
const url = 'https://www.themealdb.com/api/json/v1/1/random.php';

//onclicking the searching the search buttons.
function onclicki() {
  searchButton.addEventListener('click', () => {
    var searchValue = searchInput.value;
    var url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;

    if (searchValue !== '') {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          let output = '';
          for (let i = 0; i < data.meals.length; i++) {
            output += `
              <div id="card">
                <img src="${data.meals[i].strMealThumb}" alt=" ">
                <h3>${data.meals[i].strMeal}</h3>
                <p><a href="${data.meals[i].strYoutube}" target="_blank">Let's look at recipe</a></p>
                <button class="cook-btn" data-mealid="${data.meals[i].idMeal}">Prepare</button>
              </div>
            `;
          }
          food.innerHTML = output;
          localStorage.setItem("output", output);
          const cookButtons = document.querySelectorAll('.cook-btn');

          cookButtons.forEach(button => {
            button.addEventListener('click', (event) => {
              const mealId = event.target.getAttribute('data-mealid');
              getIngredients(mealId);
              food.style.display="none"
              randomFood.style.display="none"
            });
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
}

onclicki();

//getting the ingredients as output.
function getIngredients(mealId) {
  var url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
  ingredients_div.style.display = 'block';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      let ingrioutput = '';
      const mealThumbnail = meal.strMealThumb;
      const mealName = meal.strMeal;
      const instructions = meal.strInstructions;

      const image = `<img src="${mealThumbnail}" alt="${mealName}"></img>`;

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient) {
          ingrioutput += `
            <div>${measure} ${ingredient}</div>
          `;
        } else {
          break;
        }
      }

      const combinedOutput = `
        <div id="backbutton">
          <div>${image}</div>
          <div> <button id="Back">Back</button></div>
        </div>
        <div>${ingrioutput}</div>
        <div><strong>Instructions:</strong> ${instructions}</div>
      `;

      ingredients_div.innerHTML = combinedOutput;
      ingredients_blur_div.style.display = 'block';

      const Back = document.getElementById('Back');
      Back.onclick = () => {
        ingredients_blur_div.style.display = 'none';
        // food.style.filter = 'blur(0px)';
        // randomFood.style.filter = 'blur(0px)';
        food.style.display="block"
        food.style.display="flex"
        food.style.flexWrap="wrap"
              randomFood.style.display="block"
        onclicki();
      };
    })
    .catch(error => {
      console.log(error);
    });
}

//getting the random food on reload
function getRandomFood(url) {
  axios
    .get(url)
    .then((res) => {
      let data = res.data.meals[0];
      let outputs = `
        <div id="card">
          <img src="${data.strMealThumb}" alt="">
          <div class="meal-details">
            <p>${data.strMeal}</p>
            <p>Category: ${data.strCategory}</p>
            <p><a href="${data.strYoutube}" target="_blank"></a></p>
            <button class="cook-btn" data-mealid="${data.idMeal}">Prepare</button>
          </div>
        </div>
      `;
      randomFood.innerHTML += outputs;
      const cookButtons = document.querySelectorAll('.cook-btn');
      cookButtons.forEach(button => {
        button.addEventListener('click', (event) => {
          const mealId = event.target.getAttribute('data-mealid');
          randomFood.style.display = 'none';
          
          getIngredients(mealId);
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

getRandomFood(url);
