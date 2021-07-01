import React, { useCallback, useEffect, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [userIngredient,setUserIngredient] = useState([]);

  // useEffect(() => {
  //   fetch('https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient.json').then(
  //     response => {
  //       return response.json();
  //     }
  //   ).then(responseData => {
  //     const loadedIngreient =[];
  //     for(let key in responseData){
  //       loadedIngreient.push({
  //         id : key,
  //         title : responseData[key].title,
  //         amount : responseData[key].amount
  //       });
  //     }
  //     setUserIngredient(loadedIngreient);
  //   });
  // },[]);

  const addIngredientHandler = ingredient => {
    fetch('https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient.json',{
    method : 'POST',
    body : JSON.stringify(ingredient),
    headers : {'Contetnt-Type' : 'application/json'}
  }).then(reponse => {
    return reponse.json();
  }).then( responseData => {
    setUserIngredient(prevIngredient => 
        [...prevIngredient , 
        { id : responseData.name , ...ingredient }
      ])
    });
  };
  const setFilteredIngredient = useCallback(filteredIngredient => {
    setUserIngredient(filteredIngredient);
  },[]);
  const removeIngredientHandler = ingredientId => {
    setUserIngredient(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    );
  };


  return (
    <div className="App">
      <IngredientForm onAddIngredient = {addIngredientHandler} />

      <section>
        <Search onLoadIngredient = {setFilteredIngredient} />
        <IngredientList ingredients={userIngredient} onRemoveItem = {removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
