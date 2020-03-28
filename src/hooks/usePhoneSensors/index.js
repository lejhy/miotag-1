// @flow

import { useEffect, useRef } from 'react';
import { accelerometer, gyroscope, magnetometer } from 'react-native-sensors';

const usePhoneSensors = (active) => {
  const sensors = useRef([]);
  let subscriptions = [];

  useEffect(() => {
    if (active) {
      subscriptions.push(accelerometer.subscribe(({ x, y, z }) => {
        const pitch = (180 * Math.atan2(x, Math.sqrt(y * y + z * z))) / Math.PI;
        const roll = (180 * Math.atan2(y, Math.sqrt(x * x + z * z))) / Math.PI;
        sensors.current = [
          x, y, z,
          roll,
          pitch,
          sensors.current[5],
        ];
      }));
      subscriptions.push(magnetometer.subscribe(({ x, y, z }) => {
        const roll = sensors.current[3];
        const pitch = sensors.current[4];
        const magX = x * Math.cos(pitch)
          + y * Math.sin(roll) * Math.sin(pitch)
          + z * Math.cos(roll) * Math.sin(pitch);
        const magY = y * Math.cos(roll) - z * Math.sin(roll);
        const yaw = (180 * Math.atan2(-magY, magX)) / Math.PI;

        sensors.current = [
          ...sensors.current.slice(0, 5),
          yaw,
        ];
      }));
    } else {
      subscriptions.forEach((s) => s.remove());
      subscriptions = [];
    }
  }, [active]);

  const getPhoneImu = () => sensors.current;

  return {
    getPhoneImu
  };
};

export default usePhoneSensors;
