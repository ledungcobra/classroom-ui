import { Button, Checkbox, Dialog, DialogActions, DialogContent } from '@mui/material';
import React, { useState } from 'react';
import Form from './FormCreate/Form';

import './CreateClass.scss';

interface ICreateClassProps {
  openStatus: boolean;
  handleCloseDialog: any;
}

export const CreateClass: React.FC<ICreateClassProps> = ({ openStatus, handleCloseDialog }) => {
  const [check, setChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <Dialog
        aria-labelledby="customized-dialog-title"
        open={openStatus}
        onClose={handleCloseDialog}
        maxWidth={showForm ? 'lg' : 'xs'}
        className="form__dialog"
      >
        {showForm ? (
          <Form handleCloseDialog={handleCloseDialog} />
        ) : (
          <>
            <div className="class-create-dialog__title">
              Bạn muốn sử dụng HDH - Classroom để tạo mới một lớp học?
            </div>
            <DialogContent className="class-create-dialog__content">
              <div className="class-create-dialog__checkbox-container">
                <div className="class-create-dialog__checkbox-container__checkbox">
                  <Checkbox color="primary" onChange={() => setChecked(!check)} />
                </div>
                <p>Xác nhận tạo mới một lớp học?</p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseDialog}>
                Đóng
              </Button>

              <Button autoFocus color="primary" disabled={!check} onClick={() => setShowForm(true)}>
                Tiếp tục
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};
