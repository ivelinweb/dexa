import { IAddBookmark } from "@/interfaces/bookmark.interface";
import { postApi, deleteApi, getApi } from "./api.action";
import { IActionResponse } from "@/interfaces/response.interface";

export const addBookmark = async (
  payload: IAddBookmark
): Promise<IActionResponse> => {
  try {
    const response = await postApi("bookmarks/create", payload);
    const data = response.data;
    return {
      status: true,
      message: "success",
      data,
    };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
};

export const removeBookmark = async (id: string): Promise<IActionResponse> => {
  try {
    const response = await deleteApi(`bookmarks/remove/${id}`);
    const data = response.data;
    return {
      status: true,
      message: "success",
      data,
    };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
};

export const getBookmarkByPostId = async (
  id: string
): Promise<IActionResponse> => {
  try {
    const response = await getApi(`bookmarks/${id}`);
    const data = response.data;
    return {
      status: true,
      message: "success",
      data,
    };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
};

export const getAllBookmarks = async (): Promise<IActionResponse> => {
  try {
    const response = await getApi(`bookmarks`);
    const data = response.data;
    return {
      status: true,
      message: "success",
      data,
    };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
};
