import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  [key: string]: any;
}

interface FormState {
  [step: number]: FormData;
}
 


const initialState: FormState = {};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<{ step: number; data: FormData }>) => {
      const { step, data } = action.payload;
      state[step] = data;
    },
  },
});

export const { updateFormData } = formSlice.actions;
export default formSlice.reducer;
