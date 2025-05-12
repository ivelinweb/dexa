import React, { useState } from "react";
import AccountStep from "./Account";
import { StepperInterface } from "@/interfaces/stepper.interface";
import Bucket from "./Bucket";

type Props = {
  steps: StepperInterface[];
  activeStep: number;
  updateStep: (value: number) => void;
};

const stepComponents = [AccountStep, Bucket];

export default function IndexStepper(props: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const renderStep = (stepIndex: number) => {
    const step = props.steps[stepIndex];
    const StepComponent = stepComponents[stepIndex];
    return (
      <div className="w-full text-center">
        <div className="flex flex-col gap-2 mt-5">
          <p className="text-3xl font-semibold text-dark">{step.headline}</p>
          <p className="font-light text-medium text-lg">{step.description}</p>
        </div>
        <div className="max-w-md mx-auto mt-10 text-left">
          <StepComponent nextStep={props.updateStep} index={stepIndex + 1} />
        </div>
      </div>
    );
  };

  return <>{renderStep(props.activeStep - 1)}</>;
}
