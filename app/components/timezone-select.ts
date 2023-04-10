import Component from '@glimmer/component';
import type User from 'datafruits13/models/user';

interface TimezoneSelectArgs {
  user: User;
}

export default class TimezoneSelect extends Component<TimezoneSelectArgs> {

  // these come from rails to match the data the server expects
  // ActiveSupport::TimeZone.all.map { |m| m.name }.sort
  //
  // Maybe consider the JS version someday.... ?
  // Intl.supportedValuesOf('timeZone').length
  // 428

  timeZones = ["Abu Dhabi", "Adelaide", "Alaska", "Almaty", "American Samoa", "Amsterdam", "Arizona", "Astana", "Athens", "Atlantic Time (Canada)", "Auckland", "Azores", "Baghdad", "Baku", "Bangkok", "Beijing", "Belgrade", "Berlin", "Bern", "Bogota", "Brasilia", "Bratislava", "Brisbane", "Brussels", "Bucharest", "Budapest", "Buenos Aires", "Cairo", "Canberra", "Cape Verde Is.", "Caracas", "Casablanca", "Central America", "Central Time (US & Canada)", "Chatham Is.", "Chennai", "Chihuahua", "Chongqing", "Copenhagen", "Darwin", "Dhaka", "Dublin", "Eastern Time (US & Canada)", "Edinburgh", "Ekaterinburg", "Fiji", "Georgetown", "Greenland", "Guadalajara", "Guam", "Hanoi", "Harare", "Hawaii", "Helsinki", "Hobart", "Hong Kong", "Indiana (East)", "International Date Line West", "Irkutsk", "Islamabad", "Istanbul", "Jakarta", "Jerusalem", "Kabul", "Kaliningrad", "Kamchatka", "Karachi", "Kathmandu", "Kolkata", "Krasnoyarsk", "Kuala Lumpur", "Kuwait", "Kyiv", "La Paz", "Lima", "Lisbon", "Ljubljana", "London", "Madrid", "Magadan", "Marshall Is.", "Mazatlan", "Melbourne", "Mexico City", "Mid-Atlantic", "Midway Island", "Minsk", "Monrovia", "Monterrey", "Montevideo", "Moscow", "Mountain Time (US & Canada)", "Mumbai", "Muscat", "Nairobi", "New Caledonia", "New Delhi", "Newfoundland", "Novosibirsk", "Nuku'alofa", "Osaka", "Pacific Time (US & Canada)", "Paris", "Perth", "Port Moresby", "Prague", "Pretoria", "Puerto Rico", "Quito", "Rangoon", "Riga", "Riyadh", "Rome", "Samara", "Samoa", "Santiago", "Sapporo", "Sarajevo", "Saskatchewan", "Seoul", "Singapore", "Skopje", "Sofia", "Solomon Is.", "Srednekolymsk", "Sri Jayawardenepura", "St. Petersburg", "Stockholm", "Sydney", "Taipei", "Tallinn", "Tashkent", "Tbilisi", "Tehran", "Tijuana", "Tokelau Is.", "Tokyo", "UTC", "Ulaanbaatar", "Urumqi", "Vienna", "Vilnius", "Vladivostok", "Volgograd", "Warsaw", "Wellington", "West Central Africa", "Yakutsk", "Yerevan", "Zagreb", "Zurich"];

  get availableTimeZones() {
    return this.timeZones;
  }
}
