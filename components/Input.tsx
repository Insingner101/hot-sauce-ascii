import React, { useEffect, useState, useContext } from "react";
import { useFormContext, FieldValues } from "react-hook-form";
import { AiOutlineDown } from "react-icons/ai";

interface InputProps {
  type: "text" | "date" | "number" | "textarea";
  name: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  allowDecimal?: boolean;
  icon?: React.ReactNode;
  setValue?: React.Dispatch<any>;
  [key: string]: any;
}

interface Validator {
  required?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
}

export const CustomInput = ({
  type,
  name,
  label,
  placeholder,
  isRequired,
  allowDecimal,
  value,
  setValue,
  icon,
  ...rest
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FieldValues>();
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputValue(e.target.value);
    if (setValue) {
      setValue(e.target.value);
    }
  };

  const [validator, setValidator] = useState<Validator>({});

  const handleClick = () => {
    if (type === "date") {
      const datePick = document.querySelector(`#${name}`);
      try {
        //@ts-ignore
        datePick?.showPicker();
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    let validatorLocal: Validator = {};
    if (isRequired)
      validatorLocal.required =
        label === "" ? "Required" : `${label} is Required`;
    switch (type) {
      case "text":
        break;
      case "number":
        if (allowDecimal) {
          // Allow both whole numbers and decimal values
          validatorLocal.pattern = {
            value: /^[0-9]+(\.[0-9]+)?$/,
            message: "Enter a valid number",
          };
        } else {
          // Allow only whole numbers
          validatorLocal.pattern = {
            value: /^[0-9]*$/,
            message: "Enter a valid whole number",
          };
        }
        // Set the minimum value to 0
        validatorLocal.min = {
          value: 0,
          message: "Value must be greater than or equal to 0",
        };
        break;
      case "date":
        validatorLocal.min = {
          value: Date.now(),
          message: `${label} must be greater than or equal to today`,
        };
        // validatorLocal.pattern = {
        //   value: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
        //   message: "Enter a valid date in dd/mm/yyyy format",
        // };
        break;
      case "textarea":
        break;
      default:
        break;
    }
    setValidator(validatorLocal);
  }, []);

  return (
    <div className="mb-0 w-full h-fit">
      <label className="text-black font-medium text-opacity-[0.85] text-sm">{label}</label>
      <div
        className={`group w-full ${
          type === "textarea" ? "h-fit py-4" : "h-11"
        } px-4 mt-1 bg-white border border-lightgray shadow rounded-[5px] flex items-center cursor-pointer`}
      >
        {type === "textarea" ? (
          <textarea
            {...register(name, validator)}
            {...rest}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="flex w-full h-[7rem] bg-transparent text-light text-opacity-[0.80] placeholder-white placeholder-opacity-40  text-sm outline-none"
          />
        ) : (
          <input
            id={name}
            {...register(name, validator)}
            {...rest}
            type={type}
            step={"any"}
            autoComplete="off"
            onChange={handleChange}
            onClick={handleClick}
            placeholder={placeholder}
            value={inputValue}
            // id="inputField"
            className={`flex w-full min-w-0 bg-transparent text-light ${
              type === "date" ? "opacity-[0.40]" : "text-opacity-[0.80]"
            } placeholder-white placeholder-opacity-40  text-sm outline-none`}
          />
        )}
        {icon && (
          <div className={`text-white opacity-[0.80] w-4 h-4 cursor-pointer`}>
            {icon}
          </div>
        )}
      </div>

      <span
        className={`${
          errors[name] ? "opacity-100" : "opacity-0"
        } flex items-center gap-1 text-[#D92828] text-xs mt-1.5`}
      >
        {errors[name] ? errors[name]!.message!.toString() : "NONE"}
      </span>
    </div>
  );
};

interface DropdownProps {
  options: String[];
  //   selected: string;
  //   setSelected: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  name: string;
  placeholder: string;
  isRequired: boolean;
  [key: string]: any;
}

export const DropdownInput = ({
  options,
  //   selected,
  //   setSelected,
  label,
  name,
  value,
  placeholder,
  isRequired,
  ...rest
}: DropdownProps) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<FieldValues>();

  const [searchTerm, setSearchTerm] = useState(value || "");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowResults(true);
    const inputValue = event.target.value;
    setSearchTerm(inputValue);
    if (inputValue === "") {
    }

    // const results = allCollections.flatMap((obj) => {
    //     const matchingItems = obj.data
    //         .filter((item: any) => {
    //             const collectionName = item.collectionName.toLowerCase()
    //             const searchValue = inputValue.toLowerCase()
    //             return collectionName.includes(searchValue)
    //         })
    //         // .map((item) => item.collectionName)
    //     return matchingItems
    // })

    const results = options.filter((item: any) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSearchResults(results);
  };

  const showDropdown = (event: any) => {
    event.preventDefault();
    setShowResults(true);
    searchResults.length === 0 ? setSearchResults(options) : null;
  };

  useEffect(() => {
    if (showResults) {
      //@ts-ignore
      document.addEventListener("click", function (event) {
        //@ts-ignore
        var targetId = event.target.id;
        if (targetId != "dropdown-result-box") {
          if (
            targetId != "dropdown-search-box-1234" &&
            targetId != "dropicon-search-box-1234"
          ) {
            setShowResults(false);
          }
        }
      });
    }
  }, [showResults]);

  return (
    <div className={`select-none w-full flex flex-col justify-start mb-0`}>
      <label className="text-black text-opacity-[0.85] text-sm">{label}</label>
      <div
        className={`group relative w-full h-11 px-4 mt-1 bg-white border border-lightgray rounded-[5px] flex items-center cursor-pointer`}
      >
        <input
          title=""
          id="dropdown-search-box-1234"
          type="text"
          {...register(name, {
            required: `${label} is Required`,
          })}
          {...rest}
          autoComplete="off"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={placeholder}
          onClick={showDropdown}
          className="flex w-full bg-transparent text-light text-opacity-[0.80] placeholder-white placeholder-opacity-40 text-sm outline-none"
        />
        <AiOutlineDown
          id="dropicon-search-box-1234"
          onClick={showDropdown}
          className="text-white opacity-[0.40] w-4 h-4"
        />
        {showResults && (
          <div className="flex flex-col gap-1 w-full p-1 max-h-[9rem] overflow-y-auto bg-white border-[1px] z-10 border-lightgray rounded-md absolute mt-2 left-0 top-full">
            {searchResults?.map((item, index) => (
              <div
                key={index}
                id="dropdown-result-box"
                onClick={() => {
                  //   setSelected(item);
                  setSearchTerm(item);
                  setValue(name, item);
                  setShowResults(false);
                }}
                className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-neutral-900 cursor-pointer text-light"
              >
                {item}
                {/* <MdVerified className="text-blue-500" /> */}
              </div>
            ))}
          </div>
        )}
      </div>
      <span
        className={`${
          errors[name] ? "opacity-100" : "opacity-0"
        } flex items-center gap-1 text-[#D92828] text-xs mt-1.5`}
      >
        {errors[name] ? errors[name]!.message!.toString() : "NONE"}
      </span>
    </div>
  );
};
