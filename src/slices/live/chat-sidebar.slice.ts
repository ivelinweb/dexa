import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store";

export interface ChatSidebarState {
  isOpen: boolean;
}

const initialState = {
  isOpen: true,
} as ChatSidebarState;

export const chatSideBarSlice = createSlice({
  name: "chatsidebar",
  initialState,
  reducers: {
    setChatIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setChatIsOpen } = chatSideBarSlice.actions;

export const selectChatIsOpen = (state: RootState) => state["chatsidebar"].isOpen;

export default chatSideBarSlice.reducer;
