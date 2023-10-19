import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import Input from "./Input";
import { useState } from "react";
import Button from "../../UI/Button";
import { GlobalStyles } from "../../constants/styles";

function ExpenseForm({ onCancel, onSubmit, isEditing, defaultValues }) {
  // const [amountVal, setAmountVal] = useState("");
  /*  const [inputs, setinputs] = useState({
    amount: defaultValues ? defaultValues.amount.toString() : "",
    description: defaultValues ? defaultValues.description.toString() : "",
    date: defaultValues ? defaultValues.date.toISOString().slice(0,10) : "",
  }); */

  const [inputs, setInputs] = useState({
    amount: {
      value: defaultValues ? defaultValues.amount.toString() : "",
      isValid: !!defaultValues,
    },
    description: {
      value: defaultValues ? defaultValues.description.toString() : "",
      isValid: !!defaultValues,
    },
    date: {
      value: defaultValues
        ? new Date(defaultValues.date).toISOString().slice(0, 10)
        : "",
      isValid: !!defaultValues,
    },
  });

  function submitHandler() {
    const expenseData = {
      amount: +inputs.amount.value, // converting string to number
      description: inputs.description.value,
      date: new Date(inputs.date.value),
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;
    if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
      // Alert.alert("Invalid input", " Please check your input values");
      setInputs((currInputs) => {
        return {
          amount: { value: currInputs.amount.value, isValid: amountIsValid },
          description: {
            value: currInputs.description.value,
            isValid: descriptionIsValid,
          },
          date: { value: currInputs.date.value, isValid: dateIsValid },
        };
      });
      return;
    }
    onSubmit(expenseData);
  }

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currentinputs) => {
      return {
        ...currentinputs,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  const formIsInvalid =
    !inputs.amount.isValid ||
    !inputs.date.isValid ||
    !inputs.description.isValid;
  return (
    <View style={styles.form}>
      <Text style={styles.title}>Your Expenses</Text>
      <View style={styles.inputRow}>
        <Input
          style={styles.rowInput}
          label="Amount"
          inValid={!inputs.amount.isValid}
          textInputConfig={{
            keyboardType: "decimal-pad",
            onChangeText: inputChangeHandler.bind(this, "amount"),
            // value: inputs["amount"],
            value: inputs.amount.value,
          }}
        />
        <Input
          style={styles.rowInput}
          label="Date"
          inValid={!inputs.date.isValid}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            maxLength: 10,

            onChangeText: inputChangeHandler.bind(this, "date"),
            // value: inputs["date"],
            value: inputs.date.value,
          }}
        />
      </View>
      <Input
        label="Description"
        inValid={!inputs.description.isValid}
        textInputConfig={{
          multiline: true,
          onChangeText: inputChangeHandler.bind(this, "description"),
          // value: inputs["description"],
          value: inputs.description.value,
          // autoCorrect:false
          // autoCapitalize:'word'
        }}
      />
      {formIsInvalid && (
        <Text style={styles.errorText}> Please check your entered data</Text>
      )}
      <View style={styles.buttonsContainer}>
        <Button mode="flat" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button mode="flat" onPress={submitHandler} style={styles.button}>
          {isEditing ? "Edit" : "Add"}
        </Button>
      </View>
    </View>
  );
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
