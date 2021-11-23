import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Chip, Divider, IconButton, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box } from '@mui/system';
import copy from 'copy-to-clipboard';
import React, { useContext } from 'react';
import { AppContext } from '../../App';
import { GREEN_COLOR } from '../../constants';
import { isValidEmail } from '../../utils';
import './AddMember.scss';
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AddMemberProps {
  variant: AddMemberVariant;
  referenceLink: string;
  footerText: string;
  actionPerform: (data: string[]) => void;
  onCancel: () => void;
}

const AddMember: React.FC<AddMemberProps> = ({
  referenceLink,
  actionPerform,
  footerText,
  onCancel,
  variant,
}: AddMemberProps) => {
  const [open, setOpen] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const Context = useContext(AppContext);
  const handleClose = () => {
    setOpen(false);
    onCancel();
  };

  const timeOutRef = React.useRef<any>(null);
  let listEmailToPost = React.useRef([] as string[]);
  const [emailInvalid, setEmailInvalid] = React.useState<string>('');

  return (
    <div style={{ minWidth: '350px' }}>
      <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Typography variant="h5" color="initial">
            {variant === 'teacher' ? 'Mời giáo viên' : 'Mời học viên'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          {variant === 'student' && (
            <>
              <Box display="flex" flexDirection="column" gap="10px">
                <Typography variant="h6" color="initial">
                  Đường liên kết mời
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexDirection="row"
                >
                  <Box maxWidth="90%">
                    <Typography
                      variant="body1"
                      color="initial"
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {referenceLink}
                    </Typography>
                  </Box>

                  <IconButton
                    onClick={() => {
                      setCopied(true);
                      Context?.openSnackBar('Copied');
                      copy(referenceLink);
                      setTimeout(() => {
                        setCopied(false);
                      }, 5000);
                    }}
                  >
                    <ContentCopyIcon sx={copied ? { color: GREEN_COLOR } : {}} />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
            </>
          )}
          <Box display="flex" flexDirection="column" marginTop="10px" width="100%">
            <TextField
              id="standard-textarea"
              fullWidth
              label="Emails"
              placeholder="Nhập danh sách email"
              multiline
              error={emailInvalid !== ''}
              variant="standard"
              helperText="Mỗi email cách nhau bằng Enter"
              onChange={(e) => {
                if (timeOutRef) {
                  clearTimeout(timeOutRef.current);
                }

                timeOutRef.current = setTimeout(() => {
                  let listEmail: string[] = e.target.value.split('\n');
                  listEmail = listEmail.map((e) => e.trim()).filter((e) => e !== '') as string[];
                  let valid = true;

                  for (let email of listEmail) {
                    if (!isValidEmail(email)) {
                      valid = false;
                      setEmailInvalid(email);
                      setTimeout(() => {
                        setEmailInvalid('');
                      }, 5000);
                      break;
                    }
                  }
                  if (valid) {
                    listEmailToPost.current = listEmail as string[];
                  }
                }, 200);
              }}
            >
              <Chip label="HEllo world" />
            </TextField>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button
            color="success"
            onClick={(_) => {
              if (listEmailToPost.current && listEmailToPost.current.length > 0) {
                actionPerform(listEmailToPost.current);
              } else {
                Context?.openSnackBar('Không có gì để gửi');
              }
              handleClose();
            }}
          >
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddMember;
