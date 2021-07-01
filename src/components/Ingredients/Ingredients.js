import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [userIngredient,setUserIngredient] = useState([]);

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

  return (
    <div className="App">
      <IngredientForm onAddIngredient = {addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredient} onRemoveItem = {() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
