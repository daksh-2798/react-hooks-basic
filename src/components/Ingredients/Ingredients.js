import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [userIngredient,setUserIngredient] = useState([]);

  const addIngredientHandler = ingredient => {
    setUserIngredient(prevIngredient => 
        [...prevIngredient , 
        { id : Math.random.toString() , ...ingredient }
      ]);
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
