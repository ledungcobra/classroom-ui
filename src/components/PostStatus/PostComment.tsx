import { Box, Button, Card, CardContent } from '@mui/material';
// @ts-ignore
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js';
// @ts-ignore
import draftToHtml from 'draftjs-to-html';
import React, { useEffect, useState } from 'react';
// @ts-ignore
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { GREEN_COLOR } from '../../constants';
import { setComment, setIsEditing, useAppDispatch, useAppSelector } from '../../redux';
import './PostComment.scss';

export interface IPostStatus {
  onCancel?: () => void;
  onPost?: (content: string) => void;
}

export const PostComment: React.FC<IPostStatus> = ({ onPost }) => {
  const comment = useAppSelector((state) => state.editorReducer.comment);
  const currentCommentId = useAppSelector((state) => state.editorReducer.currentCommentId);
  const dispatch = useAppDispatch();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [editorFocus, setEditorFocus] = useState(false);
  const [content, setContent] = useState('');
  const isEditing = useAppSelector((state) => state.editorReducer.isEditing);

  useEffect(() => {
    const currentContent = editorState.getCurrentContent();
    const plainText = currentContent.getPlainText();
    if (plainText !== null && plainText !== undefined) {
      setContent(draftToHtml(convertToRaw(currentContent)));
      dispatch(setComment(draftToHtml(convertToRaw(currentContent))));
    }
  }, [editorState]);
  useEffect(() => {
    if (!isEditing) return;
    if (comment !== '') {
      setEditorState(
        EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(comment))),
      );
      dispatch(setIsEditing(false));
    }
  }, [comment, isEditing]);
  return (
    <Card className="post-status" variant="outlined">
      <CardContent>
        <Box width="100%" display="flex" gap="15px" flexDirection="column" alignItems="flex-start">
          <Editor
            onFocus={() => setEditorFocus(true)}
            onBlur={() => setEditorFocus(false)}
            className="editor-status"
            editorState={editorState}
            placeholder="Nhập vào bình luận của bạn"
            wrapperStyle={{
              backgroundColor: 'rgba(233,233,233,0.3)',
              borderRadius: '8px 8px 0 0',
              position: 'relative',
              width: '100%',
              borderBottom: editorFocus ? '3px solid ' + GREEN_COLOR : '3px solid lightgrey',
              transition: 'all 1s ease-out',
            }}
            editorStyle={{
              minHeight: 200,
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

          <Box display="flex" justifyContent="flex-end" width="100%">
            <Box display="flex" gap="15px">
              <Button variant="text">Huỷ</Button>

              <Button
                color="success"
                variant="contained"
                onClick={() => {
                  if (onPost) {
                    onPost(content);
                    setEditorState(EditorState.createEmpty());
                  }
                }}
              >
                {currentCommentId ? 'Chỉnh sửa' : 'Đăng'}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
