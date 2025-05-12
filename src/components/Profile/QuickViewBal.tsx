import {useConverter} from "@/context/currency.context";
import { UserBalance } from "@/interfaces/user.interface";
import { formatCur, isNumber, weiToUnit } from "@/libs/helpers";
import React from "react";

type Props = {
  balance?: UserBalance;
  icon?: React.JSX.Element;
};

function QuickViewBal({ balance, icon }: Props) {
  const { usdRate } = useConverter();
  const amount =
    Number(balance?.balance) > 0 ? weiToUnit(`${balance?.balance}`) : "0.00";
  const usdValue = usdRate[`${balance?.id}`] * Number(amount);

  return (
    <>
      <p className="flex items-center gap-1">
        <span className="text-3xl font-semibold">{amount}</span>
        {icon}
      </p>
      {isNumber(usdValue) && (
        <p className="text-sm font-light">${formatCur(usdValue)}</p>
      )}
    </>
  );
}

export default QuickViewBal;
