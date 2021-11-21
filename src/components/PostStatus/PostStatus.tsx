import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
// @ts-ignore
import { convertToRaw, EditorState } from 'draft-js';
// @ts-ignore
import draftToHtml from 'draftjs-to-html';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { GREEN_COLOR, MAIN_COLOR } from '../../constants';
import './PostStatus.scss';
export interface IPostStatus {
  classList: IResClassInfo[];
  onCancel?: () => void;
  onPost?: (content: string, classId: number) => void;
}

const btnStyle = (theme: any) => ({
  button: {
    '&:disabled': {
      backgroundColor: theme.palette.primary || GREEN_COLOR,
    },
  },
});

export const PostStatus: React.FC<IPostStatus> = ({ classList, onCancel, onPost }) => {
  const [selectedClass, setSelectedClass] = React.useState<string>('');

  const handleSelectClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [editorFocus, setEditorFocus] = useState(false);
  const [content, setContent] = useState('');

  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const plainText = currentContent.getPlainText();
    if (plainText) {
      setContent(draftToHtml(convertToRaw(currentContent)));
    }
  }, [editorState]);

  return (
    <Card className="post-status" variant="outlined">
      <CardContent>
        <Box width="100%" display="flex" gap="15px" flexDirection="column" alignItems="flex-start">
          <Typography variant="body1" color={MAIN_COLOR} textAlign="left">
            Dành cho
          </Typography>
          <Box display="flex" gap="10px">
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="label-class-select">Chọn lớp</InputLabel>
              <Select
                labelId="label-class-select"
                placeholder="Chọn lớp"
                required
                autoWidth
                label="Chọn lớp"
                value={selectedClass}
                onChange={handleSelectClassChange}
              >
                {classList.map((c, index) => (
                  <MenuItem key={index} value={c.id}>
                    {c.className}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Editor
            onFocus={() => setEditorFocus(true)}
            onBlur={() => setEditorFocus(false)}
            className="editor-status"
            editorState={editorState}
            placeholder="Thông báo nội dung nào đó cho lớp học"
            wrapperStyle={{
              backgroundColor: 'rgba(233,233,233,0.3)',
              borderRadius: '8px 8px 0 0',
              position: 'relative',
              width: '100%',
              borderBottom: editorFocus ? '3px solid ' + GREEN_COLOR : '3px solid lightgrey',
              transition: 'all 1s ease-out',
            }}
            editorStyle={{
              minHeight: 240,
              padding: '0px 15px',
              backgroundColor: 'rgba(233,233,233,0.3)',
            }}
            onEditorStateChange={setEditorState}
            toolbarStyle={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0)',
            }}
          />

          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex" gap="12px">
              <IconButton>
                <AddToDriveOutlinedIcon sx={{ color: GREEN_COLOR }} />
              </IconButton>
              <IconButton>
                <FileUploadOutlinedIcon sx={{ color: GREEN_COLOR }} />
              </IconButton>{' '}
              <IconButton>
                <InsertLinkOutlinedIcon sx={{ color: GREEN_COLOR }} />
              </IconButton>
              <IconButton>
                <YouTubeIcon sx={{ color: GREEN_COLOR }} />
              </IconButton>
            </Box>
            <Box display="flex" gap="15px">
              <Button variant="text" onClick={onCancel}>
                Huỷ
              </Button>
              <Button
                color="success"
                variant="contained"
                onClick={() => {
                  if (onPost && selectedClass) {
                    onPost(content, +selectedClass);
                  }
                }}
              >
                Đăng
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
