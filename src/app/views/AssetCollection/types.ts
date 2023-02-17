/* eslint-disable camelcase */
/* eslint-disable linebreak-style */
export type State = {
  errorMsg: string;
  assetInfo: AssetCollectionAssetInfo[];
  thumbnailUploadedTime: number;
  selectedAssetCollectionIds: number[];
  assetCollectionInfo: AssetCollectionInfo[];
  refreshTimeStamp: number;
  selectedAssets: AssetCollectionAssetInfo[];
  selectedAssetsIds: number[];
};

export interface assetCollectionPayload {
  name: string;
  description: string;
  thumbnailImage: string | File;
  tags: string[];
  assetIds: number[];
}

export interface AssetCollectionAssetInfo {
  access_type: string;
  access_type_id: number;
  asset_id: number;
  asset_name: string;
  file: string;
  file_name: string;
  file_type: string;
  file_type_id: 2;
  tags: [string];
}

export interface Alert {
  showAlert: boolean;
  severity: string;
  message: string;
}

export interface AssetCollectionInfo {
  description: string;
  image: string;
  image_name: string;
  medium_image: string;
  name: string;
  solution_narrative_id: number;
  tags: string[];
  thumbnail_image: string;
  is_selected?: boolean;
}
