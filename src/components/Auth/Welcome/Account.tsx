import React, { useCallback, useState, useEffect } from "react";
import Label from "@/components/Form/Label";
import Input from "@/components/Form/Input";
import Button from "@/components/Form/Button";
import { profileResolver } from "@/schemas/welcome.schema";
import ShowError from "@/components/Form/ShowError";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { config } from "@/config/wagmi.config";
import { HOSTNAME } from "@/config/env";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ContractError } from "@/libs/enum";
import { useAuth } from "@/context/auth.context";
import { registerUser } from "@/actions/auth.action";
import { debounce } from "lodash";
import { CheckCheckIcon, CircleAlertIcon } from "lucide-react";
import WalletConnectModal from "../WalletConnectModal";
import useToast from "@/hooks/toast.hook";
import Link from "next/link";
import { routes } from "@/libs/routes";

type Props = {
  nextStep: (value: number) => void;
  index: number;
};

const getError = (error: any): string => {
  // Define known error messages
  const errorMessages: { [key: string]: string } = {
    [ContractError.ERROR_DUPLICATE_RESOURCE]: "User already registered",
    [ContractError.ERROR_INVALID_STRING]: "Invalid display name or username",
  };

  // Check if error has a message property
  if (!error || !error.message) {
    return "An unknown error occurred";
  }

  // Try to find a matching error message
  const foundMessage = Object.entries(errorMessages).find(([key]) =>
    error.message.includes(key)
  );

  // Return the matched message or a generic one
  return foundMessage ? foundMessage[1] : "An error occurred";
};

export default function AccountStep({ nextStep, index }: Props) {
  // No longer using reCAPTCHA token
  const router = useRouter();
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ ...profileResolver });
  const username = watch("username");
  const { address, isConnected } = useAccount();
  const [connectModal, setConnectModal] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const { writeContractAsync } = useWriteContract({ config });
  const { setProfileProgress } = useAuth();
  const { dexaCreator, CreatorABI } = useDexa();
  const { error, success, loading } = useToast();
  const { data, refetch } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "isNameFree",
    args: [username],
    query: { enabled: false },
  });

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username) {
        const res = await refetch();
        setIsAvailable(res.data as boolean);
      } else {
        setIsAvailable(null);
      }
    }, 1000),
    []
  );

  // Removed reCAPTCHA handler

  const proceed = async (data: FieldValues) => {
    try {
      if (!isConnected) {
        setConnectModal(true);
        return;
      }
      loading({ msg: "Processing..." });
      // reCAPTCHA verification removed
      const { name, username } = data;
      await writeContractAsync(
        {
          abi: CreatorABI,
          address: dexaCreator,
          functionName: "registerCreator",
          args: [name, username, `${HOSTNAME}/${username}`],
        },
        {
          onSuccess: async (data) => {
            success({ msg: "Profile created" });
            setProfileProgress(100);
            router.replace(routes.login);
          },
          onError(err) {
            const msg = getError(err);
            error({ msg: `${msg}` });
          },
        }
      );
    } catch (err: any) {
      const msg = getError(err);
      error({ msg: `${msg}` });
    }
  };

  return (
    <>
      {connectModal && <WalletConnectModal setModal={setConnectModal} />}
      <div className="flex flex-col gap-5">
        <Controller
          control={control}
          render={({ field: { onChange } }) => (
            <Input
              name="bio"
              className="bg-light shadow-sm rounded-lg border border-medium"
              placeholder="Biography"
              onChange={onChange}
              hidden
            />
          )}
          name="bio"
        />
        <Controller
          control={control}
          render={({ field: { onChange } }) => (
            <div>
              <Label title="Display Name" isRequired={true} isMargin={true} />
              <Input
                name="name"
                className="bg-light shadow-sm rounded-lg border border-medium"
                placeholder="John Doe"
                onChange={onChange}
              />
              {errors.name && <ShowError error={errors.name.message} />}
            </div>
          )}
          name={"name"}
        />
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <div>
              <Label title="Username" isRequired={true} isMargin={true} />
              <Input
                name="username"
                className="bg-light shadow-sm rounded-lg border border-medium"
                placeholder="@james"
                onChange={(e) => {
                  onChange(e);
                  checkUsername(e.target.value);
                  setIsAvailable(null);
                }}
              />
              {isAvailable == null && username?.length > 0 && (
                <p className="text-info font-semibold">Checking...</p>
              )}
              {isAvailable == false && username?.length > 0 && (
                <div className="flex items-center gap-1">
                  <p className="text-danger font-semibold">Username Taken</p>
                  <CircleAlertIcon size={18} className="text-danger" />
                </div>
              )}
              {isAvailable == true && username?.length > 0 && (
                <div className="flex items-center gap-1">
                  <p className="text-primary font-semibold">Available</p>
                  <CheckCheckIcon size={18} className="text-primary" />
                </div>
              )}
              {errors.username && <ShowError error={errors.username.message} />}
            </div>
          )}
          name={"username"}
        />

        <div className="flex flex-col gap-5 my-5">
          <Button
            onClick={handleSubmit(proceed)}
            shape={"ROUNDED"}
            type="submit"
            className="h-12"
            kind="primary"
            disabled={isSubmitting}
          >
            Mint Profile
          </Button>
          <p className="text-center font-semibold">
            Already a Dexan?{" "}
            <Link href={routes.login} className="text-primary">
              Login
            </Link>
          </p>
          {/* ReCaptcha component removed */}
        </div>
      </div>
    </>
  );
}
