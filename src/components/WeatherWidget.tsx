import { useState, useEffect } from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, MapPin, Sun, Wind, Droplets } from 'lucide-react';
import { useStore } from '../store/useStore';

const WMO_CODES: Record<number, { icon: any, labelEn: string, labelHi: string }> = {
  0: { icon: Sun, labelEn: 'Clear sky', labelHi: 'साफ़ आसमान' },
  1: { icon: CloudSun, labelEn: 'Mainly clear', labelHi: 'मुख्यतः साफ़' },
  2: { icon: CloudSun, labelEn: 'Partly cloudy', labelHi: 'आंशिक बादल' },
  3: { icon: Cloud, labelEn: 'Overcast', labelHi: 'बादल छाए रहेंगे' },
  45: { icon: CloudFog, labelEn: 'Fog', labelHi: 'कोहरा' },
  48: { icon: CloudFog, labelEn: 'Depositing rime fog', labelHi: 'घना कोहरा' },
  51: { icon: CloudDrizzle, labelEn: 'Light drizzle', labelHi: 'हल्की बूंदाबांदी' },
  53: { icon: CloudDrizzle, labelEn: 'Moderate drizzle', labelHi: 'मध्यम बूंदाबांदी' },
  55: { icon: CloudDrizzle, labelEn: 'Dense drizzle', labelHi: 'घनी बूंदाबांदी' },
  61: { icon: CloudRain, labelEn: 'Slight rain', labelHi: 'हल्की बारिश' },
  63: { icon: CloudRain, labelEn: 'Moderate rain', labelHi: 'मध्यम बारिश' },
  65: { icon: CloudRain, labelEn: 'Heavy rain', labelHi: 'भारी बारिश' },
  71: { icon: CloudSnow, labelEn: 'Slight snow', labelHi: 'हल्की बर्फबारी' },
  73: { icon: CloudSnow, labelEn: 'Moderate snow', labelHi: 'मध्यम बर्फबारी' },
  75: { icon: CloudSnow, labelEn: 'Heavy snow', labelHi: 'भारी बर्फबारी' },
  80: { icon: CloudRain, labelEn: 'Slight rain showers', labelHi: 'हल्की बारिश की बौछारें' },
  81: { icon: CloudRain, labelEn: 'Moderate rain showers', labelHi: 'मध्यम बारिश की बौछारें' },
  82: { icon: CloudRain, labelEn: 'Violent rain showers', labelHi: 'तेज बारिश की बौछारें' },
  95: { icon: CloudLightning, labelEn: 'Thunderstorm', labelHi: 'आंधी तूफान' },
  96: { icon: CloudLightning, labelEn: 'Thunderstorm with slight hail', labelHi: 'हल्की ओलावृष्टि के साथ आंधी' },
  99: { icon: CloudLightning, labelEn: 'Thunderstorm with heavy hail', labelHi: 'भारी ओलावृष्टि के साथ आंधी' },
};

export function WeatherWidget() {
  const { language } = useStore();
  const isEn = language === 'en';
  
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
        if (!res.ok) throw new Error('Failed to fetch weather');
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error(err);
        setError(isEn ? 'Could not load weather data.' : 'मौसम डेटा लोड नहीं किया जा सका।');
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation blocked or failed. Defaulting to New Delhi.', err);
          fetchWeather(28.6139, 77.2090); // Default to New Delhi
        },
        { timeout: 5000 }
      );
    } else {
      fetchWeather(28.6139, 77.2090);
    }
  }, [isEn]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-100 animate-pulse h-64">
        <div className="h-6 w-48 bg-blue-200/50 rounded mb-4"></div>
        <div className="h-24 w-full bg-blue-200/50 rounded-xl mb-4"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isEn ? 'Weather Report' : 'मौसम रिपोर्ट'}
        </h2>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  const current = weather.current;
  const daily = weather.daily;
  const todayCode = current.weather_code;
  const weatherInfo = WMO_CODES[todayCode] || WMO_CODES[0];
  const Icon = weatherInfo.icon;

  // Farm advice based on weather
  let adviceEn = 'Good day for general farming activities.';
  let adviceHi = 'सामान्य कृषि गतिविधियों के लिए अच्छा दिन।';
  let severeAlert = null;
  let severeAlertHi = null;
  
  if ([51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 95, 96, 99].includes(todayCode)) {
    adviceEn = 'Rain/precipitation expected. Avoid spraying pesticides or fertilizers today. Ensure fields have proper drainage.';
    adviceHi = 'बारिश की उम्मीद है। आज कीटनाशकों या उर्वरकों के छिड़काव से बचें। सुनिश्चित करें कि खेतों में उचित जल निकासी हो।';
    if ([65, 75, 82, 95, 96, 99].includes(todayCode)) {
      severeAlert = 'SEVERE WEATHER ALERT: Heavy rain or thunderstorms expected. Protect equipment and livestock.';
      severeAlertHi = 'गंभीर मौसम चेतावनी: भारी बारिश या तूफान की उम्मीद है। उपकरणों और पशुओं की रक्षा करें।';
    }
  } else if (current.temperature_2m > 35) {
    adviceEn = 'High temperatures today. Water crops early morning or late evening to prevent evaporation. Protect heat-sensitive plants.';
    adviceHi = 'आज उच्च तापमान। वाष्पीकरण को रोकने के लिए सुबह जल्दी या देर शाम फसलों को पानी दें। गर्मी के प्रति संवेदनशील पौधों की रक्षा करें।';
    if (current.temperature_2m > 40) {
       severeAlert = 'EXTREME HEAT WARNING: Do not work in fields during peak afternoon hours. High risk of crop wilting.';
       severeAlertHi = 'अत्यधिक गर्मी की चेतावनी: दोपहर के चरम घंटों के दौरान खेतों में काम न करें। फसल मुरझाने का उच्च जोखिम।';
    }
  } else if (current.temperature_2m < 5) {
    adviceEn = 'Very low temperatures. Protect sensitive crops from frost if necessary.';
    adviceHi = 'बहुत कम तापमान। यदि आवश्यक हो तो संवेदनशील फसलों को पाले से बचाएं।';
    if (current.temperature_2m < 0) {
      severeAlert = 'FROST WARNING: Freezing temperatures detected. Cover sensitive crops immediately.';
      severeAlertHi = 'पाले की चेतावनी: जमा देने वाले तापमान का पता चला। संवेदनशील फसलों को तुरंत ढकें।';
    }
  } else if (current.wind_speed_10m > 25) {
    adviceEn = 'Strong winds expected. Avoid spraying activities and secure tall plants or temporary structures.';
    adviceHi = 'तेज हवाओं की उम्मीद। छिड़काव की गतिविधियों से बचें और ऊंचे पौधों या अस्थायी संरचनाओं को सुरक्षित करें।';
  }

  return (
    <section className="w-full min-w-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-100">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-blue-600" />
          {isEn ? 'Farm Weather Report' : 'खेत की मौसम रिपोर्ट'}
        </h2>
        <div className="flex items-center gap-1 text-sm text-gray-500 bg-white/60 px-2 py-1 rounded-full border border-blue-100">
          <MapPin className="w-3 h-3" />
          {isEn ? 'Current Location' : 'वर्तमान स्थान'}
        </div>
      </div>

      {severeAlert && (
        <div className="bg-red-500 text-white rounded-xl p-4 mb-4 font-bold shadow-md animate-pulse">
          {isEn ? severeAlert : severeAlertHi}
        </div>
      )}

      <div className="bg-white/80 rounded-2xl p-4 md:p-6 shadow-sm border border-white mb-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="bg-blue-100 p-4 rounded-full text-blue-600 shrink-0">
            <Icon className="w-12 h-12" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="text-4xl font-black text-gray-900 tracking-tight">
              {Math.round(current.temperature_2m)}°C
            </div>
            <div className="text-lg font-medium text-gray-700 mt-1">
              {isEn ? weatherInfo.labelEn : weatherInfo.labelHi}
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                {current.relative_humidity_2m}% {isEn ? 'Humidity' : 'नमी'}
              </div>
              <div className="flex items-center gap-1">
                <Wind className="w-4 h-4 text-gray-400" />
                {current.wind_speed_10m} km/h {isEn ? 'Wind' : 'हवा'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-900 font-medium">
        <span className="font-bold text-indigo-700 mr-2">{isEn ? 'Farm Advice:' : 'कृषि सलाह:'}</span>
        {isEn ? adviceEn : adviceHi}
      </div>

      <div className="overflow-x-auto pb-2 w-full">
        <div className="flex gap-2 min-w-max">
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
            const code = daily.weather_code[dayIndex];
            const info = WMO_CODES[code] || WMO_CODES[0];
            const DayIcon = info.icon;
            
            let dayLabel = '';
            if (dayIndex === 0) {
              dayLabel = isEn ? 'Today' : 'आज';
            } else if (dayIndex === 1) {
              dayLabel = isEn ? 'Tomorrow' : 'कल';
            } else {
              const date = new Date();
              date.setDate(date.getDate() + dayIndex);
              dayLabel = date.toLocaleDateString(isEn ? 'en-US' : 'hi-IN', { weekday: 'short' });
            }

            return (
              <div key={dayIndex} className="bg-white/60 p-3 rounded-xl border border-blue-50 text-center flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{dayLabel}</span>
                <DayIcon className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm font-bold text-gray-900">
                  {Math.round(daily.temperature_2m_max[dayIndex])}° <span className="text-gray-400 font-normal text-xs">{Math.round(daily.temperature_2m_min[dayIndex])}°</span>
                </div>
                {daily.precipitation_probability_max[dayIndex] > 20 && (
                  <div className="text-[10px] text-blue-500 mt-1 font-medium">
                    {daily.precipitation_probability_max[dayIndex]}% {isEn ? 'rain' : 'बारिश'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
