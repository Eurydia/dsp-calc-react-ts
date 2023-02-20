import { FC, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import {
  FactoryRounded,
  LocalShippingRounded,
  PowerRounded,
} from "@mui/icons-material";

import { Configuration } from "../../types";
import {
  AssetRecipes,
  Facility,
  Proliferator,
  Recipe,
  Sorter,
} from "../../assets";

import { IconDivider } from "../IconDivider";
import { SelectFacility, useFacility } from "../SelectFacility";
import { SelectRecipe, useRecipe } from "../SelectRecipe";
import { FieldNumber, useNumber } from "../FieldNumber";
import { SelectSorter, useSorter } from "../SelectSorter";
import {
  SelectProliferator,
  useProliferator,
} from "../SelectProliferator";

type FormConfigurationProps = {
  onConfigurationChange: (next_configuration: Configuration) => void;
};
export const FormConfiguration: FC<FormConfigurationProps> = (
  props,
) => {
  const { onConfigurationChange } = props;

  const { facility, setFacility } = useFacility(
    "facility",
    Facility.fromLabel("Arc Smelter")!,
  );
  const { recipe, setRecipe } = useRecipe(
    "recipe",
    Recipe.fromLabel("Copper Ingot")!,
  );
  const { proliferator, setProliferator } = useProliferator(
    "proliferator",
    Proliferator.fromLabel("None")!,
  );
  const { sorter, setSorter } = useSorter(
    "sorter",
    Sorter.fromLabel("Sorter Mk.I")!,
  );
  const {
    value: inputFlowratePerSecond,
    setValue: setInputFlowratePerSecond,
  } = useNumber("in-flow", 6);
  const {
    value: outputFlowratePerSecond,
    setValue: setOutputFlowratePerSecond,
  } = useNumber("out-flow", 6);

  useEffect(() => {
    handleFacilityChange(facility);
  }, []);

  useEffect(() => {
    onConfigurationChange({
      facility_speed_multiplier: facility.speed_multiplier,
      facility_work_consumption_MW: facility.work_consumption_MW,
      facility_idle_consumption_MW: facility.idle_consumption_MW,

      recipe_cycle_time_second: recipe.cycle_time,
      recipe_material_ratios: recipe.materials,
      recipe_product_ratios: recipe.products,

      sorter_work_consumption_MW: sorter.work_consumption,
      sorter_idle_consumption_MW: sorter.idle_consumption,

      proliferator_product_multiplier:
        proliferator.product_multiplier,
      proliferator_speed_multiplier: proliferator.speed_multiplier,
      proliferator_work_consumption_multiplier:
        proliferator.work_consumption_multiplier,

      input_flowrate_per_second: inputFlowratePerSecond,
      output_flowrate_per_second: outputFlowratePerSecond,
    });
  }, [
    facility,
    recipe,
    sorter,
    proliferator,
    inputFlowratePerSecond,
    outputFlowratePerSecond,
  ]);

  const handleFacilityChange = (next_facility: Facility) => {
    setFacility(next_facility);

    if (recipe.recipe_type === next_facility.recipe_type) {
      return;
    }
    const next_recipe: Recipe = AssetRecipes.filter((r) => {
      return r.recipe_type === next_facility.recipe_type;
    })[0];
    handleRecipeChange(next_recipe);
  };

  const handleRecipeChange = (next_recipe: Recipe) => {
    if (next_recipe.speedup_only) {
      setProliferator(Proliferator.fromLabel("None")!);
    }
    setRecipe(next_recipe);
  };

  return (
    <Box>
      <Stack spacing={3}>
        <IconDivider
          icon={<FactoryRounded color="primary" />}
          label="Manufacturer"
        />
        <Stack spacing={2}>
          <SelectFacility
            facility={facility}
            onFacilityChange={handleFacilityChange}
          />
          <SelectRecipe
            recipeType={facility.recipe_type}
            recipe={recipe}
            onRecipeChange={handleRecipeChange}
          />
        </Stack>
        <IconDivider
          icon={<LocalShippingRounded color="primary" />}
          label="Transportation"
        />
        <Stack spacing={2}>
          <FieldNumber
            suffix="/s"
            label="Input belt capacity"
            minValue={6}
            maxValue={120}
            value={inputFlowratePerSecond}
            onValueChange={setInputFlowratePerSecond}
          />
          <FieldNumber
            suffix="/s"
            label="Output belt capacity"
            minValue={6}
            maxValue={120}
            value={outputFlowratePerSecond}
            onValueChange={setOutputFlowratePerSecond}
          />
        </Stack>
        <IconDivider
          icon={<PowerRounded color="primary" />}
          label="Power usage"
        />
        <Stack spacing={2}>
          <SelectSorter sorter={sorter} onSorterChange={setSorter} />
          <SelectProliferator
            disableExtraProducts={recipe.speedup_only}
            proliferator={proliferator}
            onProliferatorChange={setProliferator}
          />
        </Stack>
      </Stack>
    </Box>
  );
};
