import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Box from '@mui/system/Box';
import React, { useEffect } from 'react';
// @ts-ignore
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useParams } from 'react-router';
import { IAppContext } from '../../App';
import { GREEN_COLOR } from '../../constants';
import { useAppContextApi, useAppDispatch, useAppSelector } from '../../redux';
import { setCurrentClassId } from '../../redux/slices/classContextSlides/classContextSlides';
import { apiClass } from '../../services/apis/apiClass';
import './ExerciseManager.scss';

interface Props {}

export interface IExercise {
  id?: number;
  name?: string;
  maxGrade?: number;
  gradeScale?: number;
  order?: number;
  description?: string;
  courseId?: number;
}

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  width: '100%',
});

const validateExercise = (exerciseState: IExercise, Context: IAppContext): boolean => {
  if (exerciseState.maxGrade !== undefined) {
    if (exerciseState.maxGrade <= 0) {
      Context?.openSnackBarError('Điểm phải lớn hơn 0');
      return false;
    }
  } else {
    Context?.openSnackBarError('Bạn chưa nhập điểm');
    return false;
  }

  if (exerciseState.name === '' || exerciseState.name === undefined) {
    Context?.openSnackBarError('Vui lòng nhập vào tên bài tập để tiếp tục');
    return false;
  }
  return true;
};

export const ExerciseManager = (props: Props) => {
  const { id } = useParams();
  const Context = useAppContextApi();
  const [exercisesState, setExercisesState] = React.useState(new Array<IExercise>());
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id && currentUser !== null) {
      Context?.showLoading();
      apiClass
        .getClassAssignments({
          courseId: parseInt(id),
          currentUser,
          SortColumn: '+Order',
        })
        .then((res) => {
          Context?.hideLoading();
          if (res?.result == 1) {
            setExercisesState(res?.content.data as IExercise[]);
            Context?.openSnackBar('Tải bài tập thành công');
          } else {
            Context?.openSnackBarError('Có lỗi xảy ra trong quá trình tải');
          }
          dispatch(setCurrentClassId(parseInt(id)));
        })
        .catch((e) => {
          Context?.hideLoading();
          Context?.openSnackBarError('Không thể tải bài tập');
        });
    }
  }, [id, currentUser]);

  const onAddExercise = (exercise: IExercise, onDone: () => void) => {
    if (!validateExercise(exercise, Context!!)) return;

    Context?.showLoading();
    apiClass
      .postAddClassAssignment({
        courseId: parseInt(id as string),
        currentUser: currentUser,
        maxGrade: exercise.maxGrade,
        name: exercise.name,
        description: exercise.description,
      } as IParamAddClassAssignment)
      .then((res) => {
        Context?.hideLoading();
        if (res?.result == 1) {
          const exercise = res?.content as IExercise;
          setExercisesState((prev) => {
            return [
              ...prev,
              {
                ...exercise,
              },
            ];
          });
          onDone();
          Context?.openSnackBar('Thêm bài tập thành công');
        } else {
          Context?.openSnackBarError('Có lỗi xảy ra trong quá trình thêm bài tập');
        }
      })
      .catch((e) => {
        Context?.hideLoading();
        Context?.openSnackBarError('Không thể thêm bài tập');
      });
  };

  const onUpdateExercise = (exercise: IExercise) => {
    if (!validateExercise(exercise, Context!!)) return;

    Context?.showLoading();
    apiClass
      .putUpdateClassAssignment({
        courseId: parseInt(id as string),
        assignmentsId: exercise.id,
        currentUser: currentUser,
        maxGrade: exercise.maxGrade,
        name: exercise.name,
        description: exercise.description,
      } as IParamUpdateClassAssignment)
      .then((res) => {
        Context?.hideLoading();
        if (res?.result == 1) {
          const exercise = res?.content as IExercise;
          setExercisesState((prev) => {
            let stateNew = prev.map((i) => {
              if (i.id == exercise.id) {
                return exercise;
              }
              return i;
            });
            return [...stateNew];
          });
          Context?.openSnackBar('Cập nhật bài tập thành công');
        } else {
          Context?.openSnackBarError('Có lỗi xảy ra trong quá trình cập nhật bài tập');
        }
      })
      .catch((e) => {
        Context?.hideLoading();
        Context?.openSnackBarError('Không thể cập nhật bài tập');
      });
  };

  const onDeleteExercise = (exId?: number) => {
    Context?.showLoading();

    apiClass
      .deleteClassAssignment({
        assignmentsId: exId,
        courseId: parseInt(id as string),
        currentUser: currentUser,
      } as IParamDeleteClassAssignment)
      .then((res) => {
        Context?.hideLoading();
        if (res?.result == 1) {
          setExercisesState((prev) => {
            let stateNew = prev.filter((i) => {
              if (i.id == exId) {
                return false;
              }
              return true;
            });
            return [...stateNew];
          });
          Context?.openSnackBar('Xoá bài tập thành công');
        } else {
          Context?.openSnackBarError('Có lỗi xảy ra trong quá trình xoá bài tập');
        }
      })
      .catch((e) => {
        Context?.hideLoading();
        Context?.openSnackBarError('Không thể xoá bài tập vì bạn đã nhập điểm cho sinh viên rồi');
      });
  };

  useEffect(() => {
    if (id && id !== '' && typeof id === 'number') {
      dispatch(setCurrentClassId(+id));
    }
  }, [id]);

  const reorder = (list: IExercise[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const temp = list[startIndex].order;
    list[startIndex].order = list[endIndex].order;
    list[endIndex].order = temp;

    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: any) => {
    //dropped outside the list
    if (!result.destination) {
      return;
    }

    Context?.showLoading();
    let source = exercisesState[result.source.index];
    let destination = exercisesState[result.destination.index];

    let body = {
      courseId: parseInt(id as string),
      assignmentSimples: [
        {
          id: source.id,
          order: destination.order,
        },
        {
          id: destination.id,
          order: source.order,
        },
      ],
      currentUser: currentUser,
    };

    const items = reorder(exercisesState, result.source.index, result.destination.index);
    setExercisesState(items);

    apiClass
      .postSortClassAssignment(body)
      .then((res) => {
        Context?.hideLoading();
        if (res?.result == 1) {
          Context?.openSnackBar('Sắp xếp bài tập thành công');
        } else {
          Context?.openSnackBarError('Có lỗi xảy ra trong quá trình sắp xếp bài tập');
        }
      })
      .catch((e) => {
        Context?.hideLoading();
        Context?.openSnackBarError('Không thể sắp xếp bài tập');
      });
  };
  return (
    <Container maxWidth="md" sx={{ marginTop: '40px' }}>
      <Box display="flex" flexDirection="column">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided: any, snapshot: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {exercisesState.map((item, index) => (
                  <Draggable key={item.id + '_'} draggableId={item.id!! + '_'} index={index}>
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <ExerciseItem
                          exercise={item}
                          onUpdateExercise={onUpdateExercise}
                          onDeleteExercise={onDeleteExercise}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <ExerciseItem isOld={false} onAddExercise={onAddExercise} />
      </Box>
    </Container>
  );
};

interface ExerciseItemProps {
  onAddExercise?: (exercise: IExercise, onDone: () => void) => void;
  onDeleteExercise?: (id?: number) => void;
  onUpdateExercise?: (exercise: IExercise) => void;
  exercise?: IExercise;
  isEditable?: boolean;
  isOld?: boolean;
}

const ExerciseItem = ({
  onAddExercise,
  isEditable: isEditting = false,
  isOld = true,
  exercise,
  onDeleteExercise,
  onUpdateExercise,
}: ExerciseItemProps) => {
  const Context = useAppContextApi();
  const [editing, setEditing] = React.useState(isEditting);
  const [exerciseState, setExerciseState] = React.useState(exercise);

  const onSave = () => {
    if (exerciseState) {
      onUpdateExercise?.(exerciseState!!);
      setEditing(false);
      Context?.openSnackBar('Thêm bài tập thành công');
    } else {
      Context?.openSnackBar('Bạn chưa nhập liệu gì');
    }
  };

  const onDelete = (id?: number) => {
    onDeleteExercise?.(id);
  };

  const onDoneAddExercise = () => {
    if (isOld) return;
    setExerciseState({ name: '', maxGrade: 0 });
  };
  return (
    <Card className="exercise-item" sx={{ marginBottom: '10px' }}>
      <Box padding="15px">
        <Grid container sx={{ height: '100%' }} spacing={2}>
          <Grid item md={11}>
            <Box display="column" justifyContent="flex-start">
              <TextField
                variant="filled"
                placeholder="Tên bài tập"
                type="text"
                label="Tên bài tập"
                fullWidth
                sx={{ marginBottom: '10px' }}
                disabled={isOld && !editing}
                value={exerciseState?.name}
                onChange={(e) => {
                  setExerciseState({
                    ...exerciseState,
                    name: e.target.value,
                  });
                }}
              />
              <TextField
                variant="filled"
                placeholder="Điểm tối đa"
                type="number"
                fullWidth
                label="Điểm tối đa"
                disabled={isOld && !editing}
                value={exerciseState?.maxGrade}
                onChange={(e) => {
                  setExerciseState({
                    ...exerciseState,
                    maxGrade: parseInt(e.target.value!!),
                  });
                }}
              />
            </Box>
          </Grid>
          <Grid item sx={{ height: '100%' }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-around"
              gap="10px"
              height="100%"
            >
              {isOld ? (
                <>
                  {!editing ? (
                    <IconButton color="success" onClickCapture={() => setEditing(true)}>
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <IconButton color="success" onClickCapture={onSave}>
                      <SaveIcon />
                    </IconButton>
                  )}
                  <IconButton>
                    <DeleteIcon color="error" onClickCapture={() => onDelete(exerciseState?.id)} />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    color="success"
                    onClickCapture={() => {
                      if (exerciseState) {
                        onAddExercise?.(exerciseState!!, onDoneAddExercise);
                      } else {
                        Context?.openSnackBar('Bạn không có exercise để thêm');
                      }
                    }}
                  >
                    <AddIcon sx={{ color: GREEN_COLOR }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};
