import React from 'react';

import { StyleSheet, Text, TextInput, View } from 'react-native';

function Input({ style, ...props }) {
  return <TextInput style={[styles.input, style]} {...props} />;
}

function KeyboardAwareScrollviewExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>KeyboardAwareScrollview</Text>
      <Input keyboardType="numeric" />
      <Input />
      <Input keyboardType="numeric" />
      <Input />
      <Input keyboardType="numeric" />
      <Input style={styles.lastInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'black',
    borderRadius: 24,
    borderWidth: 1,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderColor: 'black',
    borderRadius: 4,
    borderWidth: 1,
    color: 'black',
    height: 32,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  lastInput: {
    marginBottom: 0,
  },
});

export default KeyboardAwareScrollviewExample;
