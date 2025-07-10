import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const API_KEY = 'ff48d55b331e6fddd151bae42df2516c'

export default function App() {
  
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Lokasyon izni reddedildi');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // const { latitude, longitude } = location.coords;
      const latitude = 41.075955
      const longitude = 28.697258

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );

        const data = await response.json(); // 4. Gelen veri JSON formatında çözülür
        setWeather(data);                  // 5. State'e kaydedilir
      } catch (error) {
        setErrorMsg('Veri çekilirken hata oluştu');
      } finally {
        setLoading(false); // 6. Yükleme işlemi bitti
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.city}>{weather.name}</Text>
      <Text style={styles.temp}>{Math.round(weather.main.temp - 273.15)}°C</Text>
      <Text>{weather.weather[0].description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
