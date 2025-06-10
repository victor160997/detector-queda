import { Gyroscope } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function DoubleFlipGyroscope() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const flipCountRef = useRef(0);
  const lastFlipTimeRef = useRef(0);
  const flipTimeout = 1000;

  useEffect(() => {
    Gyroscope.setUpdateInterval(100);
    const subscription = Gyroscope.addListener(gyroscopeData => {
      setData(gyroscopeData);
      detectFlip(gyroscopeData);
    });

    return () => subscription.remove();
  }, []);

  const detectFlip = (gyro: { x: number; y: number; z: number }) => {
    const ROTATION_THRESHOLD = 5;

    const now = Date.now();

    if (Math.abs(gyro.z) > ROTATION_THRESHOLD) {
      const timeSinceLastFlip = now - lastFlipTimeRef.current;

      if (timeSinceLastFlip < flipTimeout) {
        flipCountRef.current += 1;
      } else {
        flipCountRef.current = 1;
      }

      lastFlipTimeRef.current = now;

      if (flipCountRef.current >= 5) {
        Alert.alert('Movimento detectado: virou duas vezes!');
        flipCountRef.current = 0;
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Gyroscope (velocidade angular rad/s):</Text>
      <Text>{`x: ${data.x.toFixed(2)}`}</Text>
      <Text>{`y: ${data.y.toFixed(2)}`}</Text>
      <Text>{`z: ${data.z.toFixed(2)}`}</Text>
    </View>
  );
}