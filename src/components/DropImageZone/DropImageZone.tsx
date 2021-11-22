import { Avatar, Button, Card, CardContent } from '@mui/material';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import React, { ReactElement, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { AppContext } from '../../App';
import { DEFAULT_USER_AVATAR } from '../../constants';
import { readImageBlob } from '../../utils';
import './DropImageZone.scss';

interface DropImageZoneProps {
  onUpload: (base64: string) => void;
  currentAvatarUrl?: string;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export const DropImageZone = ({ onUpload, currentAvatarUrl }: DropImageZoneProps): ReactElement => {
  const Context = React.useContext(AppContext);
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const [disableUpdateButton, setDisableUpdateButton] = React.useState(true);

  const [imageFile, setImageFile] = React.useState<string>(currentAvatarUrl ?? DEFAULT_USER_AVATAR);

  useEffect(() => {
    if (imageFile !== currentAvatarUrl) {
      setDisableUpdateButton(false);
    } else {
      setDisableUpdateButton(true);
    }
  }, [imageFile]);

  for (let file of acceptedFiles) {
    readImageBlob(file).then((r) => setImageFile(r?.toString() ?? DEFAULT_USER_AVATAR));
  }

  const handleUploadFile = () => {
    if (!disableUpdateButton) {
      onUpload(imageFile);
    } else {
      Context?.openSnackBar('Không thể upload file');
    }
  };

  return (
    <div {...getRootProps({ className: 'drop-zone' })}>
      <input {...getInputProps()} />
      <Card className="container" style={{ maxWidth: '100%', height: '100%' }}>
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            sx={{ height: '100%' }}
            justifyContent="space-between"
            alignItems="center"
            padding="25px 0px"
          >
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              {imageFile && (
                <Avatar sx={{ height: '100px', width: '100px' }} alt="Avatar" src={imageFile} />
              )}
            </StyledBadge>
            <Box display="flex" justifyContent="flex-end" gap="10px">
              <Button onClick={open}>Upload File</Button>
              <Button onClick={handleUploadFile}>Update avatar</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
