import React, { useState, useEffect } from "react";
import { Slider } from "#/components/slider/slider";
import { debounce } from "#/utils/common-utils";

const SliderWrapper = ({
  value,
  attribute,
  type = "text",
  formatCurrency,
  loanId,
  changeHandler,
  step,
  max,
  label,
  prefix,
}: {
  value: number;
  attribute: string;
  type?: string;
  formatCurrency?: (value: number) => string;
  loanId: number;
  changeHandler: (event: any, loanId: number, attribute) => void;
  step: number;
  max: number;
  label: string;
  prefix?: string;
}) => {
  const handlerDebounced = debounce(changeHandler, 200);
  const [valueRef, setValueRef] = React.useState(value);

  useEffect(() => {
    setValueRef(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-3 border-theme1-primay100 border p-3 m-2 rounded-md">
      <label className="block" htmlFor={`${label}_${loanId}`}>
        {label}
      </label>
      <div className="flex flex-row items-center flex-1 gap-3 flex-wrap">
        <div className="min-w-max w-full xl:w-1/2 flex flex-row gap-3">
          <Slider
            value={[valueRef]}
            max={max}
            step={step}
            onValueChange={(event) => {
              setValueRef(event[0]);
            }}
            onValueCommit={(event) => {
              handlerDebounced(event[0], loanId, attribute);
            }}
            prevButtonHandler={() =>
              handlerDebounced(
                parseFloat((value - step).toFixed(2)),
                loanId,
                attribute
              )
            }
            nextButtonHandler={() =>
              handlerDebounced(
                parseFloat((value + step).toFixed(2)),
                loanId,
                attribute
              )
            }
          />
        </div>

        <input
          className="text-black rounded-xl fit-content w-1/3"
          type={type}
          id={`${label}_${loanId}`}
          value={formatCurrency ? formatCurrency(value) : value}
          onChange={(event) => {
            return handlerDebounced(event.target.value, loanId, attribute);
          }}
          max={30}
        />
        {prefix && <span className="text-xl font-bold">{prefix}</span>}
      </div>
    </div>
  );
};

export default SliderWrapper;
