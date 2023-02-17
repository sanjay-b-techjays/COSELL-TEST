import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface warningEditorPayload {
  show: boolean;
  navigateAction: () => void;
}
export interface State {
  isPreviewPartnershipFormEdited: boolean;
  previewPartnershipWarningEditor: warningEditorPayload;
}

const initialState: State = {
  isPreviewPartnershipFormEdited: false,
  previewPartnershipWarningEditor: {
    show: false,
    navigateAction: null,
  },
};

export const previewPartnershipSlice = createSlice({
  name: 'previewPartnership',
  initialState,
  reducers: {
    setShowPreviewPartnershipWarningEditor(
      state,
      { payload }: PayloadAction<{ show: boolean; navigateAction: () => void }>
    ) {
      state.previewPartnershipWarningEditor = { ...payload };
    },
    setIsPreviewPartnershipFormEdited(
      state,
      { payload }: PayloadAction<{ isPreviewPartnershipFormEdited: boolean }>
    ) {
      state.isPreviewPartnershipFormEdited =
        payload.isPreviewPartnershipFormEdited;
    },
  },
});

// Actions
export const {
  setShowPreviewPartnershipWarningEditor,
  setIsPreviewPartnershipFormEdited,
} = previewPartnershipSlice.actions;

// Selectors
export const PreviewPartnershipResponse = (state: RootState) =>
  state.previewPartnershipSlice;

export default previewPartnershipSlice.reducer;
