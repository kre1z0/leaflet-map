import axios from "axios";

const API_URL = "https://msp.everpoint.ru/";

export const fetchFilters = ({ serviceId, city }) =>
  axios.get(`${API_URL}/api/service/filter`, {
    params: {
      format: "json",
      serviceId,
      city,
    },
  });
