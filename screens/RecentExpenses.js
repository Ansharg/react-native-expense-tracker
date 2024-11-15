import React, { useContext, useEffect, useState } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from '../util/http'
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

const RecentExpenses = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [error,setError] = useState();
  const expensesCtx = useContext(ExpensesContext); //we don't need this anymore as we connect firebase backend from where our data is being fetched 
  // const [fetchedExpenses,setFetchedExpenses] = useState([]) this is the old way we use to fetch data and set over there.

  useEffect(()=>{
    async function getExpenses(){
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses(); // here we added async await to run code synchronize way to get data first then show on the screen.  
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Couldn't fetch expenses! ")
      }
      setIsFetching(false);
      // setFetchedExpenses(expenses); we don't need this here as we setup it in context only.
    }
    getExpenses();
  },[]);

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />
  }

  if (isFetching) {
    return <LoadingOverlay />
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date > date7DaysAgo && expense.date <= today;
  });
  return (
    <ExpensesOutput
      fallBackText={"No expenses registered for the last 7 days."}
      expenses={recentExpenses}
      expensesPeriod={"Last 7 Days"}
    />
  );
};

export default RecentExpenses;
