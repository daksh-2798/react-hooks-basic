import React, { useCallback, useReducer, useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currentIngredient,action) => {
  switch(action.type){
    case 'SET': return action.ingredient;
    case 'ADD' : return [...currentIngredient , action.ingredient];
    case 'DELETE' : return currentIngredient.filter(ingredient => ingredient.id !== action.id);
    default : throw new Error('SHOULD NOT REACH HERE');
  }
}

const httpReducer = (currHttpState , action) => {
  switch(action.type){
    case 'SEND' : return {loading : true , error : null};
    case 'RESPONSE': return {...currHttpState , loading : false};
    case 'ERROR' : return {loading : false , error : action.errorMessage};
    case 'CLEAR' : return {...currHttpState , error : null};
    default : throw new Error('SHOULD NOT REACH HERE');
  }
}

const Ingredients = () => {
  const[userIngredient,dispatch] = useReducer(ingredientReducer,[]);
  const[httpState,httpDispatch] = useReducer(httpReducer , {loading : false , error : null})
  //const [userIngredient,setUserIngredient] = useState([]);
  //const [isLoading,setIsLoading] = useState(false);
  //const [error,setError] = useState();

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
    //setIsLoading(true);
    httpDispatch({type : 'SEND'});
    fetch('https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient.json',{
    method : 'POST',
    body : JSON.stringify(ingredient),
    headers : {'Contetnt-Type' : 'application/json'}
  }).then(reponse => {
    //setIsLoading(false);
    httpDispatch({type : 'RESPONSE'});
    return reponse.json();
  }).then( responseData => {
    // setUserIngredient(prevIngredient => 
    //     [...prevIngredient , 
    //     { id : responseData.name , ...ingredient }
    //   ])
    dispatch({
      type : 'ADD',
      ingredient : {id : responseData.name , ...ingredient}
    })}).catch(error => {
      //setError('Something Went Wrong!!');
      //setIsLoading(false);
      httpDispatch({type : 'ERROR' , errorMessage : 'Something Went Wrong!!'});
    });
  };
  const setFilteredIngredient = useCallback(filteredIngredient => {
   // setUserIngredient(filteredIngredient);
   dispatch({
     type : 'SET',
     ingredient : filteredIngredient
   });
  },[]);
  const removeIngredientHandler = ingredientId => {
    //setIsLoading(true);
    httpDispatch({type : 'SEND'});
    fetch(`https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`,
    {
      method : 'DELETE'
    }).then(reponse => {
      //setIsLoading(false);
      httpDispatch({type : 'RESPONSE'});
      // setUserIngredient(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)      
      // );
      dispatch({
        type : 'DELETE',
        id : ingredientId
      })
    }).catch(error => {
      //setError('Something Went Wrong!!');
      //setIsLoading(false);
      httpDispatch({type : 'ERROR' , errorMessage : 'Something Went Wrong!!'});
    });
  };

  const clearError = () => {
   // setError(null);
   httpDispatch({type : 'CLEAR'});
    
  } 

  return (
    <div className="App">
      {httpState.error && (<ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>)}
      <IngredientForm onAddIngredient = {addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredient = {setFilteredIngredient} />
        <IngredientList ingredients={userIngredient} onRemoveItem = {removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
