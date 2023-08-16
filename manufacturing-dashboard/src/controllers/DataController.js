import axios from 'axios';

const BASE_URL = 'http://localhost:8080';  // Update with your backend URL

class DataController {
    // Fetch data from the backend
    static getURL(endpoint) {
        return new URL(endpoint, BASE_URL).href;
    }
    static fetchData(endpoint, body) {
        return axios.post(`${BASE_URL}/${endpoint}`, body)
            .then((res) => {
                const contentType = res.headers['content-type'];
                const blob = new Blob([res.data], { type: contentType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                let fileEnd = 'txt';
                switch (contentType) {
                    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        fileEnd = 'xlsx';  // This is the extension for Excel .xlsx files
                        break;
                    case 'application/octet-stream':
                        fileEnd = 'bson';  // This is the extension for Excel .xlsx files
                        break;
                }
                a.download = `content.${fileEnd}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                throw error;
            });
    }
    // Send data to the backend
    static sendData(endpoint, data) {
        return axios.post(`${BASE_URL}/${endpoint}`, data)
            .then(response => response.data)
            .catch(error => {
                console.error("Error sending data: ", error);
                throw error;
            });
    }
}

export default DataController;
