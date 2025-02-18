import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE = path.join(__dirname, '../../db/searchHistory.json');


// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private history: string[] = [];

    async getHistory() {
    return this.history;
  }
// TODO: Define a write method that writes the updated cities array to the searchHistory.json file
// private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf8');
      return JSON.parse(data) as City[];
    } catch (error) {
      return [];
    }
  }
// TODO Define an addCity method that adds a city to the searchHistory.json file
// async addCity(city: string) {}
async addCity(city: string) {
  const cities = await this.getCities();
  cities.push(new City(Date.now().toString(), city));
  await this.write(cities);
}
// * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
// async removeCity(id: string) {}
async removeCity(id: string): Promise<boolean> {
  let cities = await this.getCities();
  const initialLength = cities.length;
  cities = cities.filter(city => city.id !== id);
  await this.write(cities);
  return cities.length < initialLength; // Returns true if a city was removed
}
}

export default new HistoryService();
