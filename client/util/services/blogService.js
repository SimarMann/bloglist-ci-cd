import axios from "axios";
import storageService from "Utilities/services/storageService";

const baseUrl = "/api/blogs";

const setAuth = () => ({
  Authorization: storageService.loadUser()?.token
    ? `Bearer ${storageService.loadUser().token}`
    : null,
});

const getAll = async () => {
  const request = await axios.get(baseUrl);
  return request.data;
};

const create = async (object) => {
  const headers = setAuth();
  const request = await axios.post(baseUrl, object, { headers });
  return request.data;
};

const update = async (object) => {
  const response = await axios.put(`${baseUrl}/${object.id}`, object);
  return response.data;
};

const remove = async (object) => {
  const headers = setAuth();
  await axios.delete(`${baseUrl}/${object.id}`, { headers });
};

const comment = async (object) => {
  await axios.post(`${baseUrl}/${object.id}/comments`, {
    comment: object.comment,
  });
};

export default { getAll, create, update, remove, comment };
