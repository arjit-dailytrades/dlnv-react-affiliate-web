import api from "./axiosInstance";

type Method = "get" | "post" | "put" | "patch" | "delete";

interface ApiOptions {
  method?: Method;
  url: string;
  data?: any;
  params?: any;
  isFormData?: boolean;
}

export const apiClient = async ({
  method = "get",
  url,
  data,
  params,
  isFormData = false,
}: ApiOptions) => {
  try {
    const config: any = {
      method,
      url,
      params,
    };

    if (data) {
      config.data = data;

      // Handle FormData
      if (isFormData) {
        config.headers = {
          "Content-Type": "multipart/form-data",
        };
      }
    }

    const response = await api(config);

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || error.message || "Something went wrong";

    throw new Error(message);
  }
};
