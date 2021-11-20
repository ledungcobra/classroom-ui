import { Card } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import React from 'react';
import './ClassDetail.scss';

export interface ClassDetailData {
  className: string;
  classCode: string;
  classDeadLine: ClassDeadLine[];
  classStatus: ClassStatus[];
}

export interface ClassDeadLine {
  deadLineName: string;
}

export interface ClassStatus {
  authorName: string;
  status: string;
  comments: Comment[];
}

export const ClassDetail = () => {
  return (
    <div className="classDetail">
      {/* Top */}
      <Card className="classDetail__top" variant="outlined">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div className="classDetail__top__className"></div>
          <div className="classDetail__top__classDetailBtn"></div>
        </Box>
      </Card>

      {/* Body */}
      <Grid className="classDetail__body" container spacing={5}>
        {/* Left Part */}
        <div className="classDetail__body__leftPart"></div>
        {/* Right Part */}
        <div className="classDetail__body__rightPart"></div>
      </Grid>
    </div>
  );
};
