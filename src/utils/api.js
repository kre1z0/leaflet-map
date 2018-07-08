import axios from "axios";

const SERVICE_ID = 12;

// 402 - авторизация отсутствует
export const fetchFilters = ({ city }) =>
  axios.get(`/api/service/filter/${SERVICE_ID}`, {
    params: {
      format: "json",
      city,
    },
  });

export const fetchCities = () =>
  axios.get(`/api/city`, {
    params: {
      format: "json",
    },
  });

// 402 - авторизация отсутствует
export const fetchFeatures = ({ city }) =>
  axios.get(`/api/service/commercerealty/${SERVICE_ID}`, {
    withCredentials: true,
    params: {
      format: "json",
      city,
    },
  });
