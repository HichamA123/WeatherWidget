import axios from "axios";

//credentials
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// this function is used to verify the typed location is valid
//returns location containing the latitude and longitute
// accepts latitude and longitude bcs the browser gps only gives that and no address
export async function getLocation(location?: string, lat?: number, lng?: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    if (!location && (lat == undefined || lng == undefined)) {
      reject(new Error('Either location or both lat and lng must be provided'));
      return;
    }

    try {
      const params = lat != undefined && lng != undefined
        ? { latlng: `${lat},${lng}`, key: GOOGLE_MAPS_API_KEY }
        : { address: location, key: GOOGLE_MAPS_API_KEY };

      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', { params });

      const { results } = response.data;

      resolve(results);
    } catch (error) {
      console.error('Error fetching location data:', error);
      reject(error);
    }
  });
}