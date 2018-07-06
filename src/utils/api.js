import axios from "axios";

const API_URL = "https://msp.everpoint.ru/api/";
const SERVICE_ID = 12;

// 402 - авторизация отсутствует
export const fetchFilters = ({ city }) =>
  axios.get(`${API_URL}service/filter/${SERVICE_ID}`, {
    params: {
      format: "json",
      city,
    },
  });

export const fetchCities = () =>
  axios.get(`${API_URL}city`, {
    params: {
      format: "json",
    },
  });

// 402 - авторизация отсутствует
export const fetchFeatures = ({ city }) =>
  axios.get(`${API_URL}service/commercerealty/${SERVICE_ID}`, {
    params: {
      format: "json",
      city,
    },
  });
