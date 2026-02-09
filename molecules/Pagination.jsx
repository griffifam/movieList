import {
  Box,
  Button,
  Pagination as MuiPagination,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const PAGE_SIZE = 30;

export const Pagination = ({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  pageSize = PAGE_SIZE,
}) => {
  const [jumpValue, setJumpValue] = useState('');

  if (totalPages <= 1) return null;

  const handleMuiChange = (_event, value) => {
    onPageChange(Math.max(1, Math.min(Number(value), totalPages)));
  };

  const handleJump = () => {
    const num = parseInt(jumpValue, 10);
    if (Number.isNaN(num) || num < 1 || num > totalPages) return;
    onPageChange(num);
    setJumpValue('');
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalResults);

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        mt: 4,
        mb: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {totalResults > 0
          ? `${startItem}–${endItem} of ${totalResults}`
          : '0 results'}
      </Typography>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleMuiChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        sx={{ '& .MuiPaginationItem-root': { color: 'white' } }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Jump to
        </Typography>
        <TextField
          size="small"
          type="number"
          placeholder="Page"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJump()}
          inputProps={{
            min: 1,
            max: totalPages,
            sx: { width: 56, color: 'white', fontSize: '0.875rem' },
          }}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
          }}
        />
        <Button variant="outlined" size="small" onClick={handleJump}>
          Go
        </Button>
      </Box>
    </Box>
  );
};

export default Pagination;
