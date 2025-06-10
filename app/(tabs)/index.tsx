import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    Accelerometer.setUpdateInterval(200); // em ms

    const subscription = Accelerometer.addListener(accelerometerData => {
      setData(accelerometerData);
      const { x, y, z } = accelerometerData;
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      if (totalForce > 2.5) {
        Alert.alert('⚠️ Queda detectada!', 'Aceleração anormal detectada.');
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detector de Quedas</Text>
      <Text>Aceleração X: {data.x.toFixed(2)}</Text>
      <Text>Aceleração Y: {data.y.toFixed(2)}</Text>
      <Text>Aceleração Z: {data.z.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});