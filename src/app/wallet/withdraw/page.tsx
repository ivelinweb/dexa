import React from "react";
import Header from "@/components/ui/Header";
import Section from "@/components/Layouts/Section";
import WithdrawForm from "@/components/Wallet/WithdrawModal";

export default function Withdraw() {
  return (
    <Section isFull={true}>
      <Header title="Transfer Fund" />
      <div className="max-w-2xl h-full overflow-scroll scrollbar-hide mx-auto w-full px-5">
        {/* <WithdrawForm /> */}
      </div>
    </Section>
  );
}
