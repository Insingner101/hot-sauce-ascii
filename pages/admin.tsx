import DTButton from "@/components/DTButton";
import { CustomInput } from "@/components/Input";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

export default function formEg() {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          className="w-full flex flex-col gap-4 max-w-[16rem]"
          autoComplete="off"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <CustomInput
            type="text"
            name="value1"
            value={""}
            label="Label 1"
            placeholder="Placeholder"
            isRequired={true}
          />
          <CustomInput
            type="text"
            name="value2"
            value={""}
            label="Label 2"
            placeholder="Placeholder"
            isRequired={true}
          />

          <button
            type="submit"
            className="text-black text-base font-medium px-5 py-1 rounded-[5px] bg-rafflesGold"
          >
            Next
          </button>
        </form>
      </FormProvider>

      <DTButton
        onClick={() => signOut({ callbackUrl: "/" })}
        className="w-[16rem] py-2"
      >
        Sign out
      </DTButton>
    </>
  );
}
