import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const chat = yup.object({
  message: yup.string().required("Enter a message"),
});

export const chatResolver = {
  resolver: yupResolver(chat),
};
