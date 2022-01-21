import { Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useAppContextApi, useAppSelector } from '../../redux';
import { apiUser } from '../../services/apis/apiUser';
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
  | 'studentID';

interface IPasswordChangeState {
  password: string;
  newPassword?: string;
  rePassword?: string;
  dirty: MyMap;
  errors: MyMap;
}
export const EditProfile = (props: IEditProfileProps) => {
  const [currentUserInfoData, setCurrentUserInfoData] = React.useState<IUserInfoData | undefined>();
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const [passwordState, setPasswordState] = React.useState<IPasswordChangeState>({
    dirty: {} as MyMap,
    errors: {} as MyMap,
    password: '',
    newPassword: '',
    rePassword: '',
  });
  const Context = useAppContextApi();

  const [userProfileState, setUserProfileState] = React.useState<IUserProfileInfoState>({
    dirty: {} as MyMap,
    firstName: '',
    middleName: '',
    lastName: '',
    personalEmail: '',
    phoneNumber: '',
    studentID: '',
    errors: {} as MyMap,
  });

  const [error, setError] = React.useState('');
  const timeOutRef = React.useRef<any>(null);

  const handleUpdatePassword = () => {
    if (
      passwordState.password === '' ||
      passwordState.newPassword === '' ||
      passwordState.rePassword === ''
    ) {
      Context?.openSnackBarError('Password không thể trống');
      return;
    }

    if (passwordState.newPassword !== passwordState.rePassword) {
      Context?.openSnackBarError('Mật khẩu cũ và mới không trùng khớp');
      return;
    }

    Context?.showLoading();
    apiUser
      .postChangeUserPassword({
        currentPassword: passwordState.password,
        currentUser: currentUser ?? '',
        newPassword: passwordState.newPassword!!,
      })
      .then((data) => {
        console.log(data);
        if (data?.content?.succeeded === true) {
          Context?.openSnackBar('Thay đổi mật khẩu thành công');

          setPasswordState((prev) => {
            return {
              ...prev,
              dirty: {} as MyMap,
              errors: {} as MyMap,
              password: '',
              newPassword: '',
              rePassword: '',
            };
          });
        } else {
          Context?.openSnackBarError('Thay đổi mật khẩu thất bại');
        }
      })
      .catch((e) => {
        Context?.openSnackBarError('Đổi password lỗi');
      })
      .finally(() => {
        Context?.hideLoading();
      });
  };
  // Load user info
  React.useEffect(() => {
    if (currentUserInfoData) return;
    Context?.showLoading();
    apiUser
      .getUserInfo({
        username: currentUser,
      })
      .then((data: IUserInfo) => {
        if (data.result === 1) {
          setCurrentUserInfoData(data.content);
          const { content } = data;

          setUserProfileState({
            ...userProfileState,
            firstName: content.firstName,
            lastName: content.lastName,
            personalEmail: content.personalEmail,
            middleName: content.middleName,
            phoneNumber: content.phoneNumber,
            studentID: content.studentID,
            disabledStudentId: !!content.studentID,
          });
        } else {
          Context?.openSnackBarError('Có lỗi xảy ra trong quá trình lấy thông tin user');
        }
      })
      .catch(() => {
        Context?.openSnackBarError('Có lỗi xảy ra trong quá trình lấy thông tin user');
      })
      .finally(() => {
        Context?.hideLoading();
      });
  }, []);

  // Effect to clear error
  React.useEffect(() => {
    if (error !== '') {
      if (timeOutRef.current !== null) {
        clearTimeout(timeOutRef.current);
      }
      timeOutRef.current = setTimeout(() => {
        setError('');
        setUserProfileState((prev) => ({
          ...prev,
          errors: {} as MyMap,
        }));
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
    console.log(value);

    setUserProfileState((userProfileState) => ({
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
    }));

    setUserProfileState((userProfileState) => ({
      ...userProfileState,
      errors: {
        ...userProfileState.errors,
        [name]: validateField(name),
      },
    }));
  };

  const handleSubmitForm = () => {
    Context?.showLoading();
    apiUser
      .postUpdateProfile({
        ...userProfileState,
        currentUser,
      })
      .then(() => {
        Context?.openSnackBar('Cập nhật profile thành công');
        setUserProfileState({
          ...userProfileState,
          disabledStudentId: true,
        });
      })
      .catch((e) => {
        console.log(e);
        Context?.openSnackBarError('Lỗi cập nhật profile');
      })
      .finally(() => {
        Context?.hideLoading();
      });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '100px' }}>
      <Grid container spacing="15px">
        <Grid item md={7} xs={12}>
          <form onChange={handleOnChange}>
            <Card>
              <CardContent>
                <Typography variant="h5" color="initial" textAlign="left" marginBottom="15px">
                  Cập nhật profile
                </Typography>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      error={!!userProfileState.errors['phoneNumber']}
                      required
                      type="tel"
                      value={userProfileState.phoneNumber}
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="Phone Number"
                      variant="standard"
                    />
                  </Grid>

                  <Grid item md={6}>
                    <TextField
                      fullWidth
                      label="Personal email"
                      error={!!userProfileState.errors['personalEmail']}
                      value={userProfileState.personalEmail}
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
                      value={userProfileState.firstName}
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
                      value={userProfileState.middleName}
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
                      value={userProfileState.lastName}
                      required
                      error={!!userProfileState.errors['lastName']}
                      placeholder="Last Name"
                      variant="standard"
                    />
                  </Grid>

                  <Grid item md={6}>
                    <TextField
                      fullWidth
                      label="Student ID"
                      type="text"
                      name="studentID"
                      id="studentID"
                      value={userProfileState.studentID}
                      required
                      disabled={!!userProfileState.disabledStudentId}
                      error={!!userProfileState.errors['studentID']}
                      placeholder="Student ID"
                      variant="standard"
                    />
                  </Grid>
                </Grid>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: '100%' }}
                >
                  <Typography variant="body2" color="red" style={{ alignSelf: 'flex-start' }}>
                    {error}
                  </Typography>
                  <Button
                    onClick={handleSubmitForm}
                    style={{ marginTop: '40px' }}
                    variant="contained"
                  >
                    Cập nhật
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </form>
        </Grid>
        <Grid item md={5} xs={12}>
          <form
            onChange={(e: any) => {
              const { name, value } = e.target;
              setPasswordState((prev) => ({
                ...passwordState,
                dirty: {
                  ...prev.dirty,
                  [name]: true,
                },
                [name]: value,
              }));
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h5" color="initial" textAlign="left" marginBottom="15px">
                  Cập nhật mật khẩu
                </Typography>

                <Grid container spacing={2}>
                  <Typography variant="h1" color="initial"></Typography>
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      name="password"
                      id="password"
                      value={passwordState.password}
                      required
                      error={!!passwordState.errors['password']}
                      placeholder="Password"
                      variant="standard"
                    />
                  </Grid>

                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordState.newPassword}
                      required
                      error={!!passwordState.errors['newPassword']}
                      placeholder="New Password"
                      variant="standard"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      name="rePassword"
                      id="rePassword"
                      value={passwordState.rePassword}
                      required
                      error={!!passwordState.errors['rePassword']}
                      placeholder="Re Password"
                      variant="standard"
                    />
                  </Grid>
                  <Box height="100px" />
                </Grid>
                <Box display="flex" justifyContent="flex-end" sx={{ width: '100%' }}>
                  <Button onClick={handleUpdatePassword} variant="contained">
                    Cập nhật
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </form>
        </Grid>
        {/* <DropImageZone onUpload={(file) => {}} /> */}
      </Grid>
    </Container>
  );
};
