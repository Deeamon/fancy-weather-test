class Location {

  static parse(locationResponse) {
    return new Location(locationResponse.city, locationResponse.country, locationResponse.loc);
  }

  get label() {
    return this._label;
  }

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  constructor(
    label,
    latitude,
    longitude,
  ) {
    this._label = label;
    this._latitude = latitude;
    this._longitude = longitude;
  }
}

class SimpleWeather {
  static parse(response) {
    return new SimpleWeather(
      response.icon,
      response.temperatureMin,
    )
  }

  get dataCloudImg() {
    return this._dataCloudImg;
  }

  get temperature() {
    return this._temperature;
  }

  constructor(
    dataCloudImg,
    temperature,
  ) {
    this._dataCloudImg = dataCloudImg;
    this._temperature = temperature;
  }
}

class DetailWeather extends SimpleWeather {

  static parse(response) {
    return new DetailWeather(
      response.currently.icon,
      response.currently.temperature,
      response.currently.summary,
      response.currently.apparentTemperature,
      response.currently.windSpeed,
      response.currently.humidity,
    );
  }
  get dataCloudImg() {
    return this._dataCloudImg;
  }

  get temperature() {
    return this._temperature;
  }

  get skyState() {
    return this._skyState;
  }

  get temprFeel() {
    return this._temprFeel;
  }

  get windSpeed() {
    return this._windSpeed;
  }

  get humidityVal() {
    return this._humidityVal;
  }

  constructor(
    dataCloudImg,
    temperature,
    skyState,
    temprFeel,
    windSpeed,
    humidity,
  ) {
    super(dataCloudImg, temperature);
    this._skyState = skyState;
    this._temprFeel = temprFeel;
    this._windSpeed = windSpeed;
    this._humidityVal = humidity;
  }
}

class ForecastItem {
  static parse(response) {
    return new ForecastItem(
      ForecastItem.parseDayOfWeek(response.time),
      SimpleWeather.parse(response),
    )
  }

  static parseDayOfWeek(unixTime) {
    return new Date(new Date(unixTime * 1000).toISOString().split('T')[0]).toLocaleString(
      'ru-RU', { weekday: 'long' });
  }

  constructor(
    dayLabel,
    weather,
  ) {
    this._dayLabel = dayLabel;
    this._weather = weather;
  }
}

class Forecast {
  static parse(response) {
    return new Forecast(
      response.daily.data.map(d => ForecastItem.parse(d)),
    )
  }
  constructor(
    forecastItems
  ) {
    this._forecastItems = forecastItems;
  }

}


class DateAndTime {
  get time() {
    return this._time;
  }

  get dateLabel() {
    return this._dateLabel;
  }

  constructor(
    time,
    dateLabel,
  ) {
    this._time = time;
    this._dateLabel = dateLabel;
  }
}

class Weather {
  static parse(
    response
  ) {
    return new Weather(
      DetailWeather.parse(response),
      Forecast.parse(response),
    )

  }

  get detailWeather() {
    return this._detailWeather;
  }

  get forecast() {
    return this._forecast;
  }

  constructor(
    detailWeather,
    forecast,
  ) {
    this._detailWeather = detailWeather;
    this._forecast = forecast;
  }

}

class Image {
  static parse(response) {
    return new Image(
      response.links.download
    )
  }

  get linkToImage() {
    return this._linkToImage;
  }

  constructor(
    linkToImage,
  ) {
    this._linkToImage = linkToImage;
  }

}

class Language {
  get label() {
    return this._label;
  }

  get value() {
    return this._value;
  }

  constructor(
    label,
    value,
  ) {
    this._label = label;
    this._value = value;
  }
}

class DegreesType {
  get label() {
    return this._label;
  }

  get value() {
    return this._value;
  }

  constructor(
    label,
    value,
  ) {
    this._label = label;
    this._value = value;
  }
}

const AVAILABLE_LANGUAGES = [
  new Language('en', 'en-EN'),
  new Language('ru', 'ru-RU'),
  new Language('be', 'be-BY'),
];

const AVAILABLE_DEGREESTYPES = [

]

class Confic {
  get selectedLanguage() {
    return this._selectedLanguage
  }

  get selectedDegreeType() {
    return this._selectedDegreeType;
  }
  constructor(
    selectedLanguage,
    selectedDegreeType,
  ) {
    this._selectedLanguage = selectedLanguage;
    this._selectedDegreeType = selectedDegreeType;
  }
}

class FanсyWeather {
  static parse(locationResponse, detailWeatherResponse, imageResponse) {
    const { detailWeather, forecast } = Weather.parse(detailWeatherResponse);
    return new FanсyWeather(
      Location.parse(locationResponse),
      null,
      detailWeather,
      forecast,
      Image.parse(imageResponse),
    )
  }
  get location() {
    return this._location;
  }

  get dateAndTime() {
    return this._dateAndTime;
  }

  get detailWeather() {
    return this._detailWeather;
  }

  get forecast() {
    return this._forecast;
  }

  get image() {
    return this._image;
  }

  constructor(
    location,
    dateAndTime = null,
    detailWeather,
    forecast,
    image,
  ) {
    this._location = location;
    this._dateAndTime = dateAndTime;
    this._detailWeather = detailWeather;
    this._forecast = forecast;
    this._image = image;
  }
}

class ElementForListener {
  get buttonSearchRef() {
    return this._buttonSearchRef;
  }

  get inputFieldRef() {
    return this._inputFieldRef;
  }


  constructor(
    buttonSearchRef,
    inputFieldRef,
  ) {
    this._buttonSearchRef = buttonSearchRef;
    this._inputFieldRef = inputFieldRef;
  }
}

class Render {
  render(fanсyWeather) {
    const { buttonSearchRef, inputFieldRef } = this._renderSearchForm();
    this._renderLocation(fanсyWeather.location);
    this._renderWeather(fanсyWeather.detailWeather);
    this._renderImage(fanсyWeather.image);

    return new ElementForListener(
      buttonSearchRef,
      inputFieldRef,
    )
  }
  _renderSearchForm() {
    const buttonSearchRef = document.createElement('button');
    buttonSearchRef.className = 'search__button';
    buttonSearchRef.type = 'search';
    buttonSearchRef.innerText = 'Search';

    const inputFieldRef = document.createElement('input');
    inputFieldRef.className = 'search__input';
    inputFieldRef.placeholder = 'Input the city';

    document.body.prepend(buttonSearchRef);
    document.body.prepend(inputFieldRef);

    return {
      buttonSearchRef,
      inputFieldRef
    }
  }

  _renderLocation(
    location
  ) {
    const labelRef = document.createElement('div');
    labelRef.className = 'label';
    labelRef.innerText = location.label;
    const latitudeRef = document.createElement('div');
    latitudeRef.className = 'label';
    latitudeRef.innerText = location.latitude;
    const longitudeRef = document.createElement('div');
    longitudeRef.className = 'label';
    longitudeRef.innerText = location.longitude;

    document.body.prepend(labelRef);
    document.body.prepend(latitudeRef);
    document.body.prepend(longitudeRef);
  }

  _renderWeather(
    weather
  ) {
    const dataCloudImgRef = document.createElement('div');
    dataCloudImgRef.className = 'label2';
    dataCloudImgRef.innerText = weather.dataCloudImg;
    const skyStateRef = document.createElement('div');
    skyStateRef.className = 'label2';
    skyStateRef.innerText = weather.skyState;


    document.body.prepend(dataCloudImgRef);
    document.body.prepend(skyStateRef);

  }

  _renderImage(
    image
  ) {
    const imageRef = document.createElement('div');
    imageRef.className = 'label3';
    imageRef.style.background = `url('${image.linkToImage}') no-repeat `;
    imageRef.style.backgroundSize = 'contain';

    document.body.prepend(imageRef);

  }
}

class LocationProvider {
  constructor() {
    this._URL = 'https://ipinfo.io/json?token=b35fb2ad7ace66';
  }

  async getLocationParams() {
    return (await fetch(this._URL)).json();
  }

}

class WeatherProvider {
  constructor() {
    this._URL = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/4992e5d3e65eb59ceb1fddfebdeb9e20/53.5359,27.3400?lang=ru&units=si';
  }

  async getWeatherParams() {
    return (await fetch(this._URL)).json();
  }

}

class ImageProvider {
  constructor() {
    // this._URL = `https://api.unsplash.com/photos/random?query=town,${town}&client_id=d2271d9ed6848a1ddfce1f192b442f96d32f8816e03960b75f4a8563bde581cf`;
    this._URL = `https://api.unsplash.com/photos/random?query=town,minsk&client_id=d2271d9ed6848a1ddfce1f192b442f96d32f8816e03960b75f4a8563bde581cf`;
  }

  async getImage() {
    return (await fetch(this._URL)).json();
  }
}


class App {
  constructor() {
    this._render = new Render();
    this._locationProvider = new LocationProvider();
    this._weatherProvider = new WeatherProvider();
    this._imageProvider = new ImageProvider();
  }

  execute() {
    Promise.all(
      [
        this._locationProvider.getLocationParams(),
        this._weatherProvider.getWeatherParams(),
        this._imageProvider.getImage(),
      ]
    ).then(([
      locationResponse,
      detailWeatherResponse,
      imageResponse,
    ]) => {
      const fanсyWeather = FanсyWeather.parse(
        locationResponse,
        detailWeatherResponse,
        imageResponse,
      );
      console.log(fanсyWeather);

      const { buttonSearchRef, inputFieldRef } = this._render.render(
        fanсyWeather
      );

      buttonSearchRef.addEventListener('click', () => {
        const valueInput = inputFieldRef.value;
        console.log(valueInput);
      });

    });
  }


}

const app = new App();
app.execute();

// to-do
//1. из текущей location берем кординаты
//2. это координаты шлем в погоду + состояние языка + градусы тип
//3. изменяем импут и делается все сначала 