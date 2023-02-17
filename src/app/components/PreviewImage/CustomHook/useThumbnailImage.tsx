import { useReducer } from 'react';

const ACTIONS = {
  SET_API_IMAGE_DETAILS: 'SET_API_IMAGE_DETAILS',
  SET_FILESELECTED_IMAGE_DETAILS: 'SET_FILESELECTED_IMAGE_DETAILS',
  SET_IMAGEFILE_CANCEL: 'SET_IMAGEFILE_CANCEL',
  SET_FILESIZE_ERROR: 'SET_FILESIZE_ERROR',
  SET_CROPPED_IMAGE: 'SET_CROPPED_IMAGE',
  CLEAR_CROPPED_IMAGE: 'CLEAR_CROPPED_IMAGE',
};

interface previewImageInput {
  key: string;
  aspectRatio: number;
}

interface previewImageState {
  name: string;
  source: string;
  file: File;
  error: string;
  croppedFile: File;
  croppedSource: string;
  cropped: boolean;
  aspectRatio: number;
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_API_IMAGE_DETAILS:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          file: action.payload.file,
          name: action.payload.name && action.payload.name,
          source:
            action.payload.source &&
            `${action.payload.source}?time=${Date.now()}`,
          croppedFile: '',
          croppedSource: '',
          error: '',
          cropped: false,
        },
      };
    case ACTIONS.SET_FILESELECTED_IMAGE_DETAILS:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          file: action.payload.file,
          name: action.payload.name,
          source: action.payload.source,
          croppedFile: '',
          croppedSource: '',
          error: '',
          cropped: false,
        },
      };
    case ACTIONS.SET_CROPPED_IMAGE:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          croppedFile: action.payload.croppedFile,
          croppedSource: action.payload.croppedSource,
          cropped: true,
        },
      };
    case ACTIONS.SET_IMAGEFILE_CANCEL:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          file: '',
          name: '',
          croppedFile: '',
          croppedSource: '',
          source: '',
          error: '',
          cropped: false,
        },
      };
    case ACTIONS.CLEAR_CROPPED_IMAGE:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          croppedFile: '',
          croppedSource: '',
          cropped: false,
        },
      };
    case ACTIONS.SET_FILESIZE_ERROR:
      return {
        ...state,
        [action.payload.key]: {
          ...state[action.payload.key],
          file: action.payload.file,
          name: action.payload.name,
          source: action.payload.source,
          croppedFile: action.payload.croppedFile,
          croppedSource: action.payload.croppedSource,
          error: action.payload.error,
          cropped: false,
        },
      };
    default:
      return state;
  }
};

const setInitialState = (identifiers: previewImageInput[]) => {
  return identifiers.reduce(
    (stateValue, idState) => ({
      ...stateValue,
      [idState.key]: {
        name: '',
        source: '',
        file: '',
        error: '',
        croppedFile: '',
        croppedSource: '',
        cropped: false,
        aspectRatio: idState.aspectRatio,
      },
    }),
    {}
  );
};

const useThumbnailImage = (identifiers: previewImageInput[]) => {
  const [imageDetails, dispatch] = useReducer(
    reducer,
    identifiers,
    setInitialState
  );

  const setFileData = (key: string, file: File) => {
    const reader = new FileReader();
    const image = new Image();
    reader.onload = function (e) {
      image.src = e.target.result.toString();
      image.onload = () => {
        if (
          Math.round(image.width / image.height) ===
          imageDetails[key].aspectRatio
        ) {
          dispatch({
            type: 'SET_FILESELECTED_IMAGE_DETAILS',
            payload: {
              name: file.name,
              source: e.target.result.toString(),
              file,
              key,
            },
          });
        } else {
          dispatch({
            type: 'SET_FILESIZE_ERROR',
            payload: {
              name: file.name,
              source: e.target.result.toString(),
              file,
              key,
              error:
                ' Selected image size is not recommended. Crop the image to proceed',
            },
          });
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return [imageDetails, dispatch, setFileData];
};

export default useThumbnailImage;
