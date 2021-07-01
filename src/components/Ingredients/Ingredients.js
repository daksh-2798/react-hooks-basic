import React, { useCallback, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {

  const [userIngredient,setUserIngredient] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [error,setError] = useState();

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
    setIsLoading(true);
    fetch('https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient.json',{
    method : 'POST',
    body : JSON.stringify(ingredient),
    headers : {'Contetnt-Type' : 'application/json'}
  }).then(reponse => {
    setIsLoading(false);
    return reponse.json();
  }).then( responseData => {
    setUserIngredient(prevIngredient => 
        [...prevIngredient , 
        { id : responseData.name , ...ingredient }
      ])
    }).catch(error => {
      setError('Something Went Wrong!!');
      setIsLoading(false);
    });
  };
  const setFilteredIngredient = useCallback(filteredIngredient => {
    setUserIngredient(filteredIngredient);
  },[]);
  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`,
    {
      method : 'DELETE'
    }).then(reponse => {
      setIsLoading(false);
      setUserIngredient(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        
      );
    }).catch(error => {
      setError('Something Went Wrong!!');
      setIsLoading(false);
    });
  };

  const clearError = () => {
    setError(null);
    
  } 

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient = {addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredient = {setFilteredIngredient} />
        <IngredientList ingredients={userIngredient} onRemoveItem = {removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
