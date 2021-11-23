import { Button, DialogActions, TextField } from '@mui/material';
import React, { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { apiClasses } from './../../../services/apis/apiClasses';
import { useAppSelector } from '../../../redux';

interface IFormCreate {
  handleCloseDialog: any;
}

type FormVaue = {
  className: string;
  section: string;
  room: string;
  subject: string;
};

const Form: React.FC<IFormCreate> = ({ handleCloseDialog }) => {
  const [createLoading, setCreateLoading] = useState(false);

  const currentUser = useAppSelector((state) => state.authReducer.currentUser);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: FormVaue) => {
    console.log(data);
    apiClasses.createNewClasses({
      className: '',
      section: '',
      room: data.room,
      subject: '',
      title: data.className,
      currentUser: currentUser,
    } as IParamCreateClasses);
    handleCloseDialog();
  };
  return (
    <div className="form">
      <p className="class-create-dialog__title">Create Class</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form__inputs">
          <TextField
            {...register('className')}
            required={true}
            id="filled-basic"
            label="Class Name (required)"
            className="form__input"
            variant="filled"
          />
          <TextField
            {...register('section')}
            id="filled-basic"
            label="Section"
            className="form__input"
            variant="filled"
          />
          <TextField
            {...register('subject')}
            id="filled-basic"
            label="Subject"
            className="form__input"
            variant="filled"
          />
          <TextField
            {...register('room')}
            id="filled-basic"
            label="Room"
            className="form__input"
            variant="filled"
          />
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDialog}>
            Close
          </Button>

          <LoadingButton loading={createLoading} type="submit" color="primary">
            Create
          </LoadingButton>
        </DialogActions>
      </form>
    </div>
  );
};

export default Form;
