import React, { useState } from "react";
import { Text, StyleSheet, View, Alert } from "react-native";
import Input from "./Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

const ExpenseForm = ({
  submitButtonLabel,
  onCancel,
  onSubmit,
  defaultValues,
}) => {
  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: true,
    },
    date: {
      value: defaultValues ? getFormattedDate(defaultValues.date) : "",
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : "",
      isValid: true,
    },
    // amount : defaultValues.amount.toString() ?? "",
    // date : getFormattedDate(defaultValues.date) ?? "",
    // description : defaultValues.description ?? ""
  });
  function inputChangedHandler(inputIdentifier, enteredValue) {
    setInputs((curInputs) => {
      return {
        ...curInputs, //prevState we use in react just like that we have implemented the curInputVales variable here.
        [inputIdentifier]: { value : enteredValue, isValid: true},
      };
    });
  }
  function onSubmitHandler() {
    const expenseData = {
      amount: +inputs.amount.value, // + this plus here converts the string to a number
      date: new Date(inputs.date.value),
      description: inputs.description.value,
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      // Alert.alert("Invalid Inputs", "please check your input values", [
      //   { text: "OK" },
      // ]);

      setInputs((curInputs)=>{
        return {
          amount : {
            value : curInputs.amount.value, 
            isValid : amountIsValid,
          },
          date : {
            value : curInputs.date.value,
            isValid : dateIsValid,
          },
          description : {
            value : curInputs.description.value,
            isValid : descriptionIsValid,
          }
        }
      })
      return;
    }

    onSubmit(expenseData);
  }

  const formIsValid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid;

  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          label="Amount"
          style={styles.rowInput}
          invalid={!inputs.amount.isValid}
          textInputConfig={{
            KeyboardType: "decimal-pad",
            onChangeText: inputChangedHandler.bind(this, "amount"),
            value: inputs.amount.value,
          }}
        />
        <Input
          label="Date"
          style={styles.rowInput}
          invalid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: "10",
            onChangeText: inputChangedHandler.bind(this, "date"),
            value: inputs.date.value,
          }}
        />
      </View>
      <Input
        label="Description"
        invalid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          // autoCapitalize : "none",
          // autoCorrect : false,
          onChangeText: inputChangedHandler.bind(this, "description"),
          value: inputs.description.value,
        }}
      />
      {formIsValid && <Text style={styles.errorText}>Invalid input values - please check your entered data!</Text>}
      <View style={styles.buttons}>
        <Button mode={"flat"} style={styles.button} onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={onSubmitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 80,
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  errorText : {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin : 8,

  }
});
