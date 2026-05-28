import { useForm } from '@tanstack/react-form';
import { Button, FormControl } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as z from "zod";
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';

const positiveNumber = (label: string) =>
  z.string().refine(
    (val) => val !== "" && !isNaN(Number(val)) && Number(val) > 0,
    `${label} must be a positive number`
  );

// define schema for form inputs with validation
const formSchema = z.object({
  sampleWeight: positiveNumber("Sample weight"),
  bulkWeight: positiveNumber("Bulk weight"),
  prepWeight: positiveNumber("Prep weight"),
});

function NumberField({ form, name, label }) {
  return (
    <form.Field
      name={name}
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;

        return (
          <TextField
            id={name}
            label={label}
            value={field.state.value ?? ""}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            error={isInvalid}
            helperText={
              isInvalid
                ? (field.state.meta.errors[0] as { message: string }).message
                : ""
            }
          />
        );
      }}
    />
  );
}
export default function App() {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const form = useForm({
    validators: {
      onChange: formSchema,
      onMount: formSchema,
    },
    onSubmit: async ({ value }) => {
      setToastMessage(JSON.stringify(value));
      setToastOpen(true);
    },
  })

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <Box>
      <form
        id="mix-prep-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FormControl>
          <NumberField form={form} name="sampleWeight" label="Sample Weight" />
          <NumberField form={form} name="bulkWeight" label="Bulk Weight" />
          <NumberField form={form} name="prepWeight" label="Prep Weight" />
          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <Button type="submit" disabled={!canSubmit}>Submit</Button>
             )}
          />  
        </FormControl>
      </form>
      <Snackbar
        open={toastOpen}
        autoHideDuration={2000}
        onClose={handleToastClose}
        message={toastMessage}
      />
    </Box>
  )
}