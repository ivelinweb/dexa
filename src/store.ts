import { configureStore } from "@reduxjs/toolkit";
import switchChainReducer from "./slices/account/switch-chain.slice";
import postSelectedReducer from "./slices/posts/post-selected.slice";
import authReducer from "./slices/account/auth.slice";
import hideBalanceReducer from "./slices/account/hide-balance.slice";
import sidebarReducer from "./slices/sidebar/sidebar.slice";
import chatSidebarReducer from "./slices/live/chat-sidebar.slice";

export const store = configureStore({
  reducer: {
    "post-selected": postSelectedReducer,
    "switch-chain": switchChainReducer,
    auth: authReducer,
    sidebar: sidebarReducer,
    chatsidebar: chatSidebarReducer,
    "hide-balance": hideBalanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
