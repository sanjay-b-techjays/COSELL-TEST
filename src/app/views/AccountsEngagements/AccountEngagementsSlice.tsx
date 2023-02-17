import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface warningEditorPayload {
  show: boolean;
  navigateAction: () => void;
}
export interface State {
  isAccountEngagementFormEdited: boolean;
  AccountEngagementWarningEditor: warningEditorPayload;
}

const initialState: State = {
  isAccountEngagementFormEdited: false,
  AccountEngagementWarningEditor: {
    show: false,
    navigateAction: null,
  },
};

export const accountEngagementsSlice = createSlice({
  name: 'accountEngagement',
  initialState,
  reducers: {
    setShowAccountEngagementWarningEditor(
      state,
      { payload }: PayloadAction<{ show: boolean; navigateAction: () => void }>
    ) {
      state.AccountEngagementWarningEditor = { ...payload };
    },
    setIsAccountEngagementFormEdited(
      state,
      { payload }: PayloadAction<{ isAccountEngagementFormEdited: boolean }>
    ) {
      state.isAccountEngagementFormEdited =
        payload.isAccountEngagementFormEdited;
    },
  },
});

// Actions
export const {
  setShowAccountEngagementWarningEditor,
  setIsAccountEngagementFormEdited,
} = accountEngagementsSlice.actions;

// Selectors
export const accountEngagementsResponse = (state: RootState) =>
  state.accountEngagementsSlice;

export default accountEngagementsSlice.reducer;
