import React, { useEffect, useState, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const {onLoadIngredient} = props;
  const [enteredFilter,setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(()=>{
    const timer = setTimeout(()=>{
      if(enteredFilter === inputRef.current.value){
        const query = enteredFilter.length === 0 
        ? '' 
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
      fetch('https://reacts-hoks-update-default-rtdb.firebaseio.com/ingredient.json'+query).then(
        response => {
          return response.json();
        }
      ).then(responseData => {
        const loadedIngreient =[];
        for(let key in responseData){
          loadedIngreient.push({
            id : key,
            title : responseData[key].title,
            amount : responseData[key].amount
          });
        }
        onLoadIngredient(loadedIngreient);
      });
      }
    },500);
    return () => {
      clearTimeout(timer);
    }
  },[enteredFilter,onLoadIngredient,inputRef]);


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value = {enteredFilter} 
            onChange = {event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
