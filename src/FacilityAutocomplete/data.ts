// Copyright (c) 2022 Eurydia
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { RecipeType } from "../enums";
import { Facility } from "./types";

const FACILITIES: Facility[] = [
  {
    label: "arc smelter",
    cycle_multiplier: 1,
    work_consumption: 0.36,
    idle_consumption: 0.012,
    recipe_type: RecipeType.SMELTING_FACILITY,
  },
  {
    label: "plane smelter",
    cycle_multiplier: 2,
    work_consumption: 1.44,
    idle_consumption: 0.048,
    recipe_type: RecipeType.SMELTING_FACILITY,
  },
  {
    label: "assembler mk. 1",
    cycle_multiplier: 0.75,
    work_consumption: 0.27,
    idle_consumption: 0.012,
    recipe_type: RecipeType.ASSEMBLER,
  },
  {
    label: "assembler mk. 2",
    cycle_multiplier: 1,
    work_consumption: 0.54,
    idle_consumption: 0.015,
    recipe_type: RecipeType.ASSEMBLER,
  },
  {
    label: "assembler mk. 3",
    cycle_multiplier: 1.5,
    work_consumption: 1.08,
    idle_consumption: 0.018,
    recipe_type: RecipeType.ASSEMBLER,
  },
  {
    label: "oil refinery",
    cycle_multiplier: 1,
    work_consumption: 0.96,
    idle_consumption: 0.024,
    recipe_type: RecipeType.REFINING_FACILITY,
  },
  {
    label: "chemical plant",
    cycle_multiplier: 1,
    work_consumption: 0.72,
    idle_consumption: 0.024,
    recipe_type: RecipeType.CHEMICAL_FACILITY,
  },
  {
    label: "miniature particle collider",
    cycle_multiplier: 1,
    work_consumption: 12,
    idle_consumption: 0.12,
    recipe_type: RecipeType.PARTICLE_COLLIDER,
  },
  {
    label: "matrix lab",
    cycle_multiplier: 1,
    work_consumption: 0.48,
    idle_consumption: 0.012,
    recipe_type: RecipeType.RESEARCH_FACILITY,
  },
];

export default FACILITIES;
