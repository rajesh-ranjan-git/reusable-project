import { FormStateType } from "@/types/types/actions.types";

export const initialState: FormStateType = {
  success: false,
  status: "IDLE",
  code: "INITIAL",
  statusCode: 0,
  message: "",
  details: null,
  timestamp: new Date().toISOString(),
  metadata: null,
  errors: {},
  inputs: {},
};
