import axios from "axios";

const API = "http://127.0.0.1:8000/api/v1";

export const generateCaption = async (image) => {

    console.log("Sending request to:", API);

    const formData = new FormData();
    formData.append("file", image);

    const response = await axios.post(
        `${API}/caption/generate`,
        formData
    );

    return response.data;
};