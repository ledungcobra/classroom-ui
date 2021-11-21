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
              Using Classroom at a school with students?
            </div>
            <DialogContent className="class-create-dialog__content">
              <div className="class-create-dialog__checkbox-container">
                <div className="class-create-dialog__checkbox-container__checkbox">
                  <Checkbox color="primary" onChange={() => setChecked(!check)} />
                </div>
                <p>
                  I've read and understand the above notice, and I'm not using Classroom at a school
                  with students
                </p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleCloseDialog}>
                Close
              </Button>

              <Button autoFocus color="primary" disabled={!check} onClick={() => setShowForm(true)}>
                Continue
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};
