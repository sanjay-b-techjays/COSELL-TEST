/* eslint-disable linebreak-style */
export type State = {
  errorMsg: string;
  assetCollectionInfo: salesHubAssetCollectionInfo[];
  selectedSalesHubId: string;
  salesHubInfo: SalesHubInfo[];
  refreshTimeStamp: number;
  isSalesHubFormEdited: boolean;
  showSalesHubWarningEditor: warningEditorPayload;
};

export interface warningEditorPayload {
  show: boolean;
  navigateAction: () => void;
}
export interface salesHubPayload {
  headerText: string;
  subHeaderText: string;
  headerImg: string | File;
  fontColor: string;
  fontFamily: string;
  assetCollectionId: string[];
}

export interface salesHubAssetCollectionInfo {
  description: string;
  image: string;
  imageName: string;
  mediumImage: string;
  name: string;
  assetCollectionId: number;
  tags: string[];
  thumbnailImage: string;
  isSelected?: boolean;
}
export interface SalesHubInfo {
  headerText: string;
  subHeaderText: string;
  headerImg: string | File;
  fontColor: string;
  fontFamily: string;
  salesHubId: number;
}

export interface assetCollectionData {
  asset_count: number;
  description: string;
  image: string;
  image_name: string;
  is_selected: false;
  medium_image: string;
  name: string;
  solution_narrative_id: number;
  tags: string[];
  thumbnail_image: string | File;
}
