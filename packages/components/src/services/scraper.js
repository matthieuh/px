import { get } from "dot-prop";
import config from "../../../../config";

const getUrlFromName = async name => {
  const response = await fetch(`${config.API_BASE_URL}/search?q=${name}`);
  const result = await response.json();
  return get(result, "0.link");
};

const getItemsFromName = async name => {
  const response = await fetch(`${config.API_BASE_URL}/search?q=${name}`);
  const result = await response.json();
  return result;
};

const fetchDataFromUrl = async url => {
  const response = await fetch(`${config.API_BASE_URL}/search?q=${url}`);
  return response.json();
};

export default {
  getItemsFromName,
  fetchDataFromUrl
};
