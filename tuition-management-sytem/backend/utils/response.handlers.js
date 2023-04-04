const successRespond = (response, status = 201) => {
    return function (data) {
      if (!data) {
        return response.status(204).json({ status: 204, message: "Not Found" });
      }
      return response.status(status).json(data);
    };
  };
  
  const notFoundRespond = (response) => {
    return function (data) {
      if (!data) {
        return response.status(204).json({ status: 204, message: "Not Found" });
      }
      return response.status(404).json({ status: 404, details: "Not Found" });
    };
  };
  
  const errorRespond = (response) => {
    return function (error) {
      return response.status(400).json({ status: 400, message: error.message });
    };
  };
  
  const unauthorizedRespond = (response) => {
    return function (data) {
      if (!data) {
        return response.status(204).json({ status: 204, message: "Not Found" });
      }
      return response.status(401).json({ details: data });
    };
  };
  
  const forbiddenRespond = (response) => {
    return function (data) {
      if (!data) {
        return response.status(204).json({ status: 204, message: "Not Found" });
      }
      return response.status(403).json({ details: data });
    };
  };
  
  export default {
    successRespond,
    notFoundRespond,
    errorRespond,
    unauthorizedRespond,
    forbiddenRespond,
  };
  