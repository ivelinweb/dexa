import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isAddress } from "ethers";

export const withdrawal = yup.object({
  token: yup.string().required("Choose a token"),
  // to: yup
  //   .string()
  //   .required("Enter a withdrawal address")
  //   .test("valid", "Wallet address is not valid", (value: string) => {
  //     return isAddress(value);
  //   }),
  amount: yup
    .number()
    .positive("Enter a valid amount")
    .required("Enter withdrawal amount"),
});

export const withdrawalResolver = {
  resolver: yupResolver(withdrawal),
};
