import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyAlRybBXuqp8NrMNUG_0YivMl8RQchW4gc";

export async function getLocation(location : string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: location,
            key: GOOGLE_MAPS_API_KEY
          }
        });
    
        const {results} = response.data;
  
        resolve(results);
      } catch (error) {
        console.error("Error fetching location data:", error);
        reject(false);
      }
  })
}
