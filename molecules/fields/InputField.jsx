import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useController } from 'react-hook-form';

const InputField = ({ name, label, type, icon, control }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required: `${label} is required` },
  });

  return (
    <FormControl variant="outlined" fullWidth sx={{ m: 1 }} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        {...field}
        label={label}
        value={field.value ?? ''}
        type={isPasswordType && !showPassword ? 'password' : 'text'}
        endAdornment={
          <InputAdornment position="end">
            {icon && icon}
            {isPasswordType && (
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )}
          </InputAdornment>
        }
      />
      {error && (
        <Typography variant="caption" color="error">
          {error.message}
        </Typography>
      )}
    </FormControl>
  );
};

export default InputField;
