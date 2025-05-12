import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const profile = yup.object({
  name: yup.string().required("Enter your display name"),
  username: yup.string().required("Enter your username"),
  bio: yup.string(),
});

export const profileResolver = {
  resolver: yupResolver(profile),
};

export const bucket = yup.object({
  bucket: yup.string().required("Enter your bucket name"),
});

export const bucketResolver = {
  resolver: yupResolver(bucket),
};
