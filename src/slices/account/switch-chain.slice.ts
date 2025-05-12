import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export interface SwitchChain {
  value: boolean;
}

const initialState = {
  value: false,
} as SwitchChain;

export const switchChainSlice = createSlice({
  name: "switch-chain",
  initialState,
  reducers: {
    setSwitchChain: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setSwitchChain } = switchChainSlice.actions;

export const selectSwitchChain = (state: RootState) =>
  state["switch-chain"].value;

export default switchChainSlice.reducer;
