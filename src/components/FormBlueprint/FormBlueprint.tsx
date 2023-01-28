import {
  ChangeEvent,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

import {
  AutocompleteFacility,
  AutocompleteRecipe,
  AutocompleteSorter,
  FieldNumber,
  useFacility,
  useNumber,
  useRecipe,
  useSorter,
} from "../../components";

import { Recipe } from "../../assets";
import { Proliferator, ProliferatorMode } from "../../types";
import { FlagContext } from "../../contexts";
import { FormProductionTargets } from "../FormProductionTargets";
import { FormProliferator } from "../FormProliferator";
import { ViewSummary } from "../ViewSummary";
import { getSupportableFacility } from "./helper";

type FormBlueprintProps = {};
export const FormBlueprint: FC<FormBlueprintProps> = (props) => {
  const { flags } = useContext(FlagContext);

  const { facility, setFacility } = useFacility("facilitty");
  const { recipe, setRecipe } = useRecipe("recipe");
  const { sorter, setSorter } = useSorter("sorter");

  const { value: inFlow, setValue: setInFlow } = useNumber("in-flow");
  const { value: outFlow, setValue: setOutFlow } =
    useNumber("out-flow");

  const { value: prolifMode, setValue: setProlifMode } =
    useNumber("prolif-mode");
  const { value: prolifLevel, setValue: setProlifLevel } =
    useNumber("prolif-level");

  const [targets, setTargets] = useState(
    (): { [K: string]: number } => {
      const state: { [K: string]: number } = {};
      for (const label of Object.keys(recipe.products)) {
        state[label] = 0;
      }
      return state;
    },
  );
  const handleRecipeChange = useCallback(
    (next_recipe: Recipe): void => {
      if (next_recipe.speedup_only) {
        setProlifMode(1);
      }
      setRecipe(next_recipe);
      setTargets((_) => {
        const next: { [K: string]: number } = {};
        for (const label of Object.keys(next_recipe.products)) {
          next[label] = 0;
        }
        return next;
      });
    },
    [],
  );

  const handleTargetChange = useCallback(
    (label: string, next_value: number): void => {
      setTargets((prev) => {
        const next = { ...prev };
        next[label] = next_value;
        return next;
      });
    },
    [],
  );

  const {
    speed_multiplier: prolifSpeedMultiplier,
    product_multiplier: prolifProductMultiplier,
    power_multiplier: prolifPowerMultiplier,
  } = useMemo(() => {
    return Proliferator.getMultiplier({
      level: prolifLevel,
      mode:
        prolifMode === 0
          ? ProliferatorMode.EXTRA_PRODUCTS
          : ProliferatorMode.EXTRA_SPEED,
    });
  }, [prolifLevel, prolifMode]);

  const cycles_per_minute = ((): number => {
    const { cycle_time } = recipe;
    const { speedup_multiplier } = facility;
    return (
      (60 / cycle_time) * speedup_multiplier * prolifSpeedMultiplier
    );
  })();

  const facility_max_supportable = ((): number => {
    const { materials, products } = recipe;

    const input_supportable: number = getSupportableFacility(
      inFlow * 60,
      Math.max(...Object.values(materials)) * cycles_per_minute,
      flags,
    );

    const output_supportable: number = getSupportableFacility(
      outFlow * 60,
      Math.max(...Object.values(products)) *
        cycles_per_minute *
        prolifProductMultiplier,
      flags,
    );

    const supportable: number = Math.min(
      input_supportable,
      output_supportable,
    );
    if (flags.preferEven && supportable % 2 === 1) {
      return supportable - 1;
    }
    return supportable;
  })();

  const facility_needed = ((): number => {
    if (Object.values(targets).every((value) => value === 0)) {
      return facility_max_supportable;
    }
    const { products: ratios } = recipe;
    return Math.max(
      ...Object.keys(targets).map((key) => {
        return Math.ceil(
          targets[key] /
            (ratios[key] *
              cycles_per_minute *
              prolifProductMultiplier),
        );
      }),
    );
  })();

  const consumptionIdle = ((): number => {
    const { idle_consumption: f } = facility;

    const f_consumption = f * facility_needed;
    if (!flags.accountForSortersConsumption) {
      return f_consumption;
    }
    const { idle_consumption: s } = sorter;
    const { products, materials } = recipe;
    const s_count =
      Object.keys(materials).length + Object.keys(products).length;
    const s_consumption = s_count * s;

    return s_consumption + f_consumption;
  })();

  const consumptionWork = ((): number => {
    const { work_consumption: f } = facility;

    const f_consumption = f * prolifPowerMultiplier * facility_needed;
    if (!flags.accountForSortersConsumption) {
      return f_consumption;
    }

    const { work_consumption: s } = sorter;
    const { products, materials } = recipe;
    const s_count =
      Object.keys(materials).length + Object.keys(products).length;
    const s_consumption = s * s_count;

    return f_consumption + s_consumption;
  })();

  const billMaterial = ((): { [K: string]: number } => {
    const bill: { [K: string]: number } = {};
    Object.entries(recipe.materials).map((entry) => {
      const [key, value] = entry;
      bill[key] = value * facility_needed * cycles_per_minute;
    });
    return bill;
  })();

  const billProduct = ((): { [K: string]: number } => {
    const bill: { [K: string]: number } = {};
    Object.entries(recipe.products).map((entry) => {
      const [key, value] = entry;
      bill[key] =
        value *
        facility_needed *
        cycles_per_minute *
        prolifProductMultiplier;
    });
    return bill;
  })();

  return (
    <Paper>
      <Box padding={2}>
        <Stack spacing={3}>
          <Box>
            <Stack spacing={2}>
              <AutocompleteFacility
                facility={facility}
                onFacilityChange={setFacility}
              />
              <AutocompleteRecipe
                recipeType={facility.recipe_type}
                recipe={recipe}
                onRecipeChange={handleRecipeChange}
              />
              <AutocompleteSorter
                sorter={sorter}
                onSorterChange={setSorter}
              />
            </Stack>
          </Box>
          <Box>
            <Grid container spacing={2} columns={{ xs: 1, sm: 2 }}>
              <Grid item xs={1}>
                <FieldNumber
                  label="Input flowrate"
                  suffix="/s"
                  minValue={0}
                  maxValue={120}
                  value={inFlow}
                  onValueChange={setInFlow}
                />
              </Grid>
              <Grid item xs={1}>
                <FieldNumber
                  label="Output flowrate"
                  suffix="/s"
                  minValue={0}
                  maxValue={120}
                  value={outFlow}
                  onValueChange={setOutFlow}
                />
              </Grid>
            </Grid>
          </Box>
          <FormProliferator
            mode={prolifMode}
            level={prolifLevel}
            disableExtraProduct={recipe.speedup_only}
            onModeChange={setProlifMode}
            onLevelChange={setProlifLevel}
          />
          <FormProductionTargets
            targets={targets}
            onTargetChange={handleTargetChange}
          />
          <ViewSummary
            facilityMax={facility_max_supportable}
            facilityNeeded={facility_needed}
            consumptionIdle={consumptionIdle}
            consumptionWork={consumptionWork}
            billProduct={billProduct}
            billMaterial={billMaterial}
          />
        </Stack>
      </Box>
    </Paper>
  );
};