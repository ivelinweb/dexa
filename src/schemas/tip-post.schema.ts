import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export const tip = yup.object({
  currency: yup.string().required("Choose currency"),
  amount: yup.string().required("Enter tip amount"),
});

export const tipResolver = {
  resolver: yupResolver(tip),
};
