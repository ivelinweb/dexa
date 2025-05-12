import { uploadApi } from "./api.action";
import { IActionResponse } from "@/interfaces/response.interface";

export const createPost = async (
  payload: FormData
): Promise<IActionResponse> => {
  try {
    const response = await uploadApi("posts/create", payload);
    const data = response.data;
    if (response.status == true && response.statusCode == 201) {
      return {
        status: true,
        message: "success",
        data: { ...data },
      };
    }
    return { status: false, message: "false" };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
};
