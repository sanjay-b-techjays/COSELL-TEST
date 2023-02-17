/* eslint-disable linebreak-style */
export type State = {
  errorMsg: string;
  flag: string;
  refreshTimeStamp: number;
};

export interface uploadAssetPayload {
  assetName: string;
  assetType: string;
  assetFileType: string;
  assetFile: string;
  tags: string[];
  status: string;
}
