import { ChangeEvent, FC, ReactNode, useCallback } from "react";
import { InputAdornment, TextField } from "@mui/material";

import { clamp } from "./helper";

type FieldNumberProps = {
  small?: boolean;
  suffix: ReactNode;
  label: string;

  minValue: number;
  maxValue: number;
  value: number;
  onValueChange: (next_value: number) => void;
};
export const FieldNumber: FC<FieldNumberProps> = (props) => {
  const {
    minValue,
    maxValue,
    suffix,
    small,
    label,
    value,
    onValueChange,
  } = props;

  const handleValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value_input: string = event.target.value;
      if (value_input === "") {
        onValueChange(minValue);
        return;
      }

      const value_parsed: number = Number.parseInt(value_input);
      if (Number.isNaN(value_parsed)) {
        return;
      }

      const value_clamped: number = clamp(
        value_parsed,
        minValue,
        maxValue,
      );
      onValueChange(value_clamped);
    },
    [minValue, maxValue],
  );

  return (
    <TextField
      fullWidth
      size={small ? "small" : undefined}
      label={label}
      value={value}
      onChange={handleValueChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">{suffix}</InputAdornment>
        ),
        inputProps: {
          inputMode: "numeric",
          style: { textAlign: "right" },
        },
      }}
    />
  );
};
