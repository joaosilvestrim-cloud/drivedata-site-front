import { SolutionModel } from "@/common/model/solution.model";

export type FindManySolutionParams = {
  search?: string;
};

export type FindManySolutionResult = SolutionModel[];
