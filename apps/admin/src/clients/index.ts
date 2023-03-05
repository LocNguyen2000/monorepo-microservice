import axios from "axios";

export const userClient = {
  endpoint: "http://0.0.0.0:8001",

  async getFilterEmployees(
    page?: string,
    size?: string,
    filter?: Record<string, unknown>
  ) {
    try {
      let api = new URL(`${this.endpoint}/employees/filter`);
      if (page) api.searchParams.append("page", page);
      if (size) api.searchParams.append("size", size);

      console.log(api.toString());

      const { data } = await axios.get(api.toString());
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
};
