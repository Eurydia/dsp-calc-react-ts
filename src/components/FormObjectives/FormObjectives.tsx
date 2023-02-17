import { FC, Fragment } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { StarRounded } from "@mui/icons-material";

import { FieldNumber } from "../FieldNumber";

type FormItemProps = {
  isPrimaryObjective: boolean;
  label: string;
  value: number;
  onValueChange: (next_value: number) => void;
};
const FormItem: FC<FormItemProps> = (props) => {
  const { isPrimaryObjective, label, value, onValueChange } = props;

  const { palette } = useTheme();

  return (
    <Box>
      <Grid
        container
        alignItems="center"
        spacing={1}
        columns={{ xs: 5, sm: 10 }}
      >
        <Grid item xs={5} sm={3} md={1}>
          <Stack direction="row" spacing={2}>
            <StarRounded
              color="primary"
              visibility={isPrimaryObjective ? "visible" : "hidden"}
            />
            <Typography
              color={
                isPrimaryObjective
                  ? palette.primary.main
                  : palette.text.primary
              }
            >
              {label}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs>
          <FieldNumber
            label=""
            suffix="/min"
            minValue={0}
            maxValue={Number.MAX_SAFE_INTEGER - 1}
            value={value}
            onValueChange={onValueChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

type FormObjectivesProps = {
  products: { [K: string]: number };
  objectives: { [K: string]: number };
  onObjectiveChange: (label: string, next_value: number) => void;
};
export const FormObjectives: FC<FormObjectivesProps> = (props) => {
  const { products, objectives, onObjectiveChange } = props;

  let goal_value = 0;
  let goal_label = "";

  for (const label of Object.keys(products)) {
    const ratio = objectives[label] / products[label];
    if (ratio >= goal_value) {
      goal_label = label;
      goal_value = ratio;
    }
  }

  return (
    <Box>
      <Stack spacing={3.5}>
        {Object.entries(objectives).map((entry) => {
          const [label, value] = entry;
          return (
            <FormItem
              key={label}
              isPrimaryObjective={label === goal_label}
              label={label}
              value={value}
              onValueChange={(next_value) => {
                onObjectiveChange(label, next_value);
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
};