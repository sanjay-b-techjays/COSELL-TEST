import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root:focus .MuiOutlinedInput-notchedOutline ': {
      borderColor: '#4c70e3 !important',
      borderWidth: '2px',
      color: 'var(--app--placeholder)',
    },
    '& .MuiOutlinedInput-inputMarginDense::placeholder': {
      color: 'var(--app--placeholder)',
      fontSize: '14px',
      fontWeight: '400',
      fontFamily: 'Inter, sans-serif',
    },
    '& .MuiOutlinedInput-inputMarginDense': {
      color: 'var(--app--placeholder)',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#4c70e3 !important',
      borderWidth: '2px',
    },
  },
  paperScrollPaper: {
    '& .MuiPaper-root ,.MuiPaper-elevation ,.MuiPaper-rounded ,.MuiPaper-elevation24 ,.MuiDialog-paper ,.MuiDialog-paperScrollPaper ,.MuiDialog-paperWidthMd ,.MuiDialog-paperFullWidth ,.css-rnmm7m-MuiPaper-root-MuiDialog-paper':
      {
        minWidth: '70vw',
        width: '80vw',
        maxWidth: '100vw',
      },
  },
});
