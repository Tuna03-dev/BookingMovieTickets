import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
// Import các slice reducer ở đây (ví dụ: import authReducer from './authSlice')
// const rootReducer = combineReducers({ auth: authReducer, ... });
const rootReducer = combineReducers({
  auth: authReducer,
  // Thêm các slice reducer ở đây
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Persist trạng thái auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt check tuần tự hóa cho redux-persist
    }),
});

export const persistor = persistStore(store);

// Hooks chuẩn cho typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 