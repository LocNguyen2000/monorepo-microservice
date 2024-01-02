import axios from "axios";

export const userClient = {
  endpoint: "http://0.0.0.0:8001",

  async getFilterRentProvider(
    page?: string,
    size?: string,
    filter?: Record<string, unknown>
  ) {
    try {
      let api = new URL(`${this.endpoint}/rent-providers`);
      if (page) api.searchParams.append("page", page);
      if (size) api.searchParams.append("size", size);

      console.log(api.toString());

      const response = await axios.get(api.toString());
      return response;
    } catch (error) {
      throw error;
    }
  },

  async getFilterTenant(
    page?: string,
    size?: string,
    filter?: Record<string, unknown>
  ) {
    try {
      let api = new URL(`${this.endpoint}/customers`);
      if (page) api.searchParams.append("page", page);
      if (size) api.searchParams.append("size", size);

      console.log(api.toString());

      const response = await axios.get(api.toString());
      return response;
    } catch (error) {
      throw error;
    }
  },
};
