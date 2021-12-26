import React, { useEffect } from 'react';
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

// @ts-ignore
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useParams } from 'react-router';
import { GREEN_COLOR } from '../../constants';
import { useAppContextApi, useAppSelector } from '../../redux';
import { apiClass } from '../../services/apis/apiClass';
import './ExerciseManager.scss';

interface Props {}

interface IExercise {
  id?: number;
  name?: string;
  maxGrade?: number;
  gradeScale?: number;
  order?: number;
  description?: string;
  courseId?: number;
}

interface ExerciseItemProps {
  onAddExercise?: (exercise: IExercise) => void;
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
  const [position, setPosition] = React.useState({
    x: 0,
    y: 0,
  });

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

  return (
    <Card className="exercise-item" sx={{ marginBottom: '10px' }}>
      <Box padding="15px">
        <Grid container sx={{ height: '100%' }}>
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
          <Grid item md={1} sx={{ height: '100%' }}>
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
                    <IconButton color="success" onClick={() => setEditing(true)}>
                      <EditIcon />
                    </IconButton>
                  ) : (
                    <IconButton color="success" onClick={onSave}>
                      <SaveIcon />
                    </IconButton>
                  )}
                  <IconButton>
                    <DeleteIcon color="error" onClick={() => onDelete(exerciseState?.id)} />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    color="success"
                    onClick={() => {
                      console.log('ADDED');
                      setExerciseState((prev) => {
                        return {
                          ...prev,
                          name: undefined,
                          maxGrade: undefined,
                        };
                      });
                      if (exerciseState) {
                        onAddExercise?.(exerciseState!!);
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

const findMax = (
  exercises: IExercise[],
  test: (current: IExercise, max: IExercise) => boolean,
): IExercise | null => {
  if (!exercises) return null;
  if (exercises.length == 0) return null;
  let max = exercises[0];

  for (let i = 1; i < exercises.length; i++) {
    // Test that make max fail
    if (test(exercises[i], max)) {
      max = exercises[i];
    }
  }
  return max;
};

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

export const ExerciseManager = (props: Props) => {
  const { id } = useParams();
  const Context = useAppContextApi();
  const [exercisesState, setExercisesState] = React.useState(new Array<IExercise>());
  const currentUser = useAppSelector((state) => state.authReducer.currentUser);

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
          Context?.setCurrentClassId(parseInt(id));
        })
        .catch((e) => {
          Context?.hideLoading();
          Context?.openSnackBarError('Không thể tải bài tập');
        });
    }
  }, [id, currentUser]);

  const onAddExercise = (exercise: IExercise) => {
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
        Context?.openSnackBarError('Không thể xoá bài tập');
      });
  };

  useEffect(() => {
    if (id && id !== '' && typeof id === 'number') {
      Context?.setCurrentClassId(+id);
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
      {/* Brief */}
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
