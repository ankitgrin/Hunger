import './App.css'
import {useState, useEffect} from 'react'
import parseHtml from 'html-react-parser'

function App() {
  const [searchInputTxt, setsearchInputTxt] = useState("");
  const [mealItems, setmealItems] = useState("");
  const [isItem, setisItem] = useState(false);
  const [mealRecipe, setmealRecipe] = useState("");
  const [showMealRecipe, setshowMealRecipe] = useState(false);
  
  const getMealList = val =>{
      if(val.trim() === ""){
          setisItem(true);
          setmealItems(`Enter an ingredient for meal!`);
      } else{
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${val.trim()}`)
        .then(response => response.json())
        .then(data => {
          let html = ``;
          {
            if(data.meals){
              data.meals.forEach(meal =>{
                html += `
                  <div className="meal-item" data-id = "${meal.idMeal}">
                    <div className="meal-img">
                      <img src="${meal.strMealThumb}" alt="" />
                    </div>
                    <div className="meal-name">
                      <h3>${meal.strMeal}</h3>
                      <a href="#" className="recipe-btn">Get Recipe</a>
                    </div>
                  </div>
                `;
              });
              setisItem(false);
            } else{
              html = `Sorry, we didn't find any meal!`;
              setisItem(true);
            }
            setmealItems(html);
          }
        })
      }
  }

  const getMealRecipe = e =>{
      {
        e.preventDefault();
        if(e.target.classList.contains('recipe-btn')){
          let meal = e.target.parentElement.parentElement;
          fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.dataset.id}`)
          .then(response => response.json())
          .then(data =>{
              mealRecipeModal(data.meals[0]);
          })
        }
      }
  }

  const mealRecipeModal = meal =>{
      let html = `
        <h2 className="recipe-title">${meal.strMeal}</h2>
        <div className="recipe-meal-img">
          <img src="${meal.strMealThumb}" alt="" />
        </div>
        <p className="recipe-category">${meal.strCategory}</p>
        <div className="recipe-instruct">
          <h3>Instructions:</h3>
          <p>${meal.strInstructions}</p>
        </div>
        <div className="recipe-link">
          <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
      `;
      setmealRecipe(html);
      setshowMealRecipe(true);
  }

  useEffect(() => {
    getMealList("egg");
  }, []);

  return (
    <>
      <div className="container">
        <div className="meal-wrapper">
          <div className="meal-search">
            <h2 className="title">Find Meals For Your Ingredients</h2>
            <blockquote>Real food doesn't have ingredients, real food is ingredients. <br />
            <cite>- Jamie Oliver</cite>
            </blockquote>

            <div className="meal_upper_box">
            <div className="meal-search-box">
              <input value={searchInputTxt} onInput={e => setsearchInputTxt(e.target.value)} type="text" className="search-control" placeholder="Enter an ingredient" id="search-input" />
              <button onClick={()=>getMealList(searchInputTxt)} type="submit" className="search-btn btn" id="search-btn">
                <i className="fas fa-search"></i>
              </button>
            </div>
            </div>

            <div className="meal-result">
              {/* <h2 className="title">Your Search Results:</h2> */}
              <div onClick={(e)=>getMealRecipe(e)} id="meal" className={isItem?"notFound":""}>
                { parseHtml (mealItems) }
              </div>
            </div>

          <div className={showMealRecipe?"showRecipe meal-details":"meal-details"}>
            <button onClick={()=>setshowMealRecipe(false)} type="button" className="btn recipe-close-btn" id="recipe-close-btn">
              <i className="fas fa-times"></i>
            </button>

            <div className="meal-details-content">
            { parseHtml (mealRecipe) }
            </div>
          </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
