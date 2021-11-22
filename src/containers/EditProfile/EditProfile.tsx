import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { AppContext } from '../../App';
import { DropImageZone } from '../../components';
import { getCamelCaseArray as normalizeCamelCase, isValidEmail, isValidPhone } from '../../utils';

interface IEditProfileProps {}

type MyMap = {
  [key: string]: any;
};
interface IUserProfileInfoState extends IUserProfileInfo {
  dirty: MyMap;
  errors: MyMap;
}

type TextFieldName =
  | 'firstName'
  | 'lastName'
  | 'middleName'
  | 'personalEmail'
  | 'phoneNumber'
  | 'personalPhoneNumber'
  | 'studentId';

export const EditProfile = (props: IEditProfileProps) => {
  const [userProfileState, setUserProfileState] = React.useState<IUserProfileInfoState>({
    dirty: {} as MyMap,
    firstName: '',
    middleName: '',
    lastName: '',
    personalEmail: '',
    phoneNumber: '',
    errors: {} as MyMap,
  });
  const [error, setError] = React.useState('');
  const timeOutRef = React.useRef<any>(null);
  const myRole: Role = 'ROLE_STUDENT';

  // Effect to clear error
  React.useEffect(() => {
    if (error !== '') {
      if (timeOutRef.current !== null) {
        clearTimeout(timeOutRef.current);
      }
      timeOutRef.current = setTimeout(() => {
        setError('');
        setUserProfileState({
          ...userProfileState,
          errors: {} as MyMap,
        });
      }, 3000);
    }
  }, [error]);

  React.useEffect(() => {
    setError(
      Object.keys(userProfileState)
        .map((fieldName) => userProfileState.errors[fieldName])
        .join('\n'),
    );
  }, [userProfileState]);

  const validateField = (name: TextFieldName): boolean | undefined | string => {
    if (!!!userProfileState.dirty[name]) {
      return undefined;
    }
    let hasError = userProfileState[name] === '';

    if (hasError) {
      return normalizeCamelCase(name) + ' can not empty';
    }
    if (name.toLowerCase().includes('email')) {
      hasError = hasError || !isValidEmail(userProfileState[name]);
    } else if (name.toLocaleLowerCase().includes('phone')) {
      hasError = hasError || !isValidPhone(userProfileState[name]);
    }

    if (!!hasError) {
      return normalizeCamelCase(name) + ' invalid';
    }
  };

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;

    setUserProfileState({
      ...userProfileState,
      dirty: {
        ...userProfileState.dirty,
        [name]: true,
      },
      [name]: value,
      errors: {
        ...userProfileState.errors,
        [name]: validateField(name),
      },
    });

    setUserProfileState({
      ...userProfileState,
      errors: {
        ...userProfileState.errors,
        [name]: validateField(name),
      },
    });
  };

  const Context = React.useContext(AppContext);
  const handleSubmitForm = () => {
    // TODO SUBMIT FORM
    Context?.openSnackBar('Submited');
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '100px' }}>
      <form onChange={handleOnChange}>
        <Grid container>
          <Grid item md={8} xs={12}>
            <Typography variant="h5" color="initial" textAlign="left" marginBottom="15px">
              Update Profile
            </Typography>

            <Grid container spacing={2}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  error={!!userProfileState.errors['phoneNumber']}
                  required
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Personal phone number"
                  error={!!userProfileState.errors['personalPhoneNumber']}
                  type="tel"
                  name="personalPhoneNumber"
                  id="personalPhoneNumber"
                  placeholder="Phone Number"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Personal email"
                  error={!!userProfileState.errors['personalEmail']}
                  type="email"
                  name="personalEmail"
                  id="personalEmail"
                  placeholder="Personal Email"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="First name"
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  error={!!userProfileState.errors['firstName']}
                  placeholder="First Name"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Middle name"
                  type="text"
                  name="middleName"
                  id="middleName"
                  required
                  error={!!userProfileState.errors['middleName']}
                  placeholder="Middle Name"
                  variant="standard"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label="Last name"
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  error={!!userProfileState.errors['lastName']}
                  placeholder="Last Name"
                  variant="standard"
                />
              </Grid>
              {myRole === 'ROLE_STUDENT' && (
                <Grid item md={6}>
                  <TextField
                    fullWidth
                    label="Student ID"
                    type="text"
                    name="studentId"
                    id="studentId"
                    required
                    error={!!userProfileState.errors['studentId']}
                    placeholder="Student ID"
                    variant="standard"
                  />
                </Grid>
              )}
            </Grid>

            <Box display="flex" alignItems="flex-end" flexDirection="column">
              <Button onClick={handleSubmitForm} variant="contained">
                Update
              </Button>
              <Typography variant="body2" color="red" style={{ alignSelf: 'flex-start' }}>
                {error}
              </Typography>
            </Box>
          </Grid>
          <Grid item md={4} xs={12}>
            <DropImageZone onUpload={(file) => {}} />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
