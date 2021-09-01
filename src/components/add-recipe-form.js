import React, { useState } from "react"
import { Formik, Form, Field, FieldArray, useField } from "formik"
import {
  makeStyles,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  IconButton,
  Typography,
} from "@material-ui/core"
import { AddCircle, Delete } from "@material-ui/icons"
import { nanoid } from "nanoid"
import axios from "axios"
import * as Yup from "yup"
import PropTypes from "prop-types"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: "1.5rem",
    position: "absolute",
    maxHeight: "95%",
    overflowY: "scroll",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    width: "90%",
    [theme.breakpoints.up("md")]: {
      minWidth: 600,
      width: "50%",
    },
  },
}))

const CustomSelect = props => {
  const { options, id, label, name } = props
  // eslint-disable-next-line react/destructuring-assignment
  const [field, , helpers] = useField(props.field)

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      id={id}
      select
      value={
        options && options.find(option => option.value === field.value).value
      }
      onChange={option => helpers.setValue(option.target.value)}
      onBlur={field.onBlur}
    >
      {options.map(option => (
        <MenuItem key={nanoid()} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}

const AddRecipeForm = React.forwardRef((props, ref) => {
  const { handleSubmit } = props
  const classes = useStyles()
  const today = new Date()

  const initialValues = {
    title: "",
    id: nanoid(),
    image: "",
    description: "",
    date: `${today.getFullYear()}-${
      today.getMonth() + 1 < 10
        ? `0${today.getMonth() + 1}`
        : today.getMonth() + 1
    }-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`,
    ingredients: [
      {
        item: "",
        amount: 0,
        unit: "g",
      },
    ],
    method: [""],
  }

  const schema = {
    title: Yup.string().required("Required"),
    image: Yup.string(),
    description: Yup.string().required("Required"),
    date: Yup.string().required("Required"),
    ingredients: Yup.array().of(
      Yup.object().shape({
        item: Yup.string().required("Required"),
        amount: Yup.number().required("Required"),
        unit: Yup.string().required(),
      })
    ),
    method: Yup.array().of(Yup.string()),
  }

  const units = [
    {
      value: "g",
      label: "g",
    },
    {
      value: "kg",
      label: "kg",
    },
    {
      value: "number",
      label: "number",
    },
    {
      value: "tbsp",
      label: "tbsp",
    },
    {
      value: "tsp",
      label: "tsp",
    },
  ]

  return (
    <Paper ref={ref} className={classes.paper} elevation={3}>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object(schema)}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values)
          setSubmitting(false)
        }}
      >
        {({ handleChange, handleBlur, errors, touched, values }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <Field
                  fullWidth
                  id="title"
                  name="title"
                  label="Title"
                  component={TextField}
                  autoFocus
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.title && Boolean(errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Field
                  fullWidth
                  id="date"
                  name="date"
                  label="Date"
                  component={TextField}
                  type="date"
                  defaultValue={values.date}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.date && Boolean(errors.date)}
                  helperText={touched.date && errors.date}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  fullWidth
                  id="image"
                  name="image"
                  label="Image Link"
                  component={TextField}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.image && Boolean(errors.image)}
                  helperText={touched.image && errors.image}
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  id="description"
                  name="description"
                  label="Description"
                  component={TextField}
                  fullWidth
                  multiline
                  rows={5}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>
              <FieldArray
                name="ingredients"
                render={arrayHelpers => (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Ingredients</Typography>
                    {values.ingredients.map((ingredient, i) => (
                      <Grid
                        container
                        spacing={2}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${values.id}-ingredient-${i}`}
                      >
                        <Grid item xs={5} sm={6}>
                          <Field
                            fullWidth
                            id={`ingredients[${i}].item`}
                            name={`ingredients[${i}].item`}
                            label="Item"
                            component={TextField}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <Field
                            fullWidth
                            id={`ingredients[${i}].amount`}
                            name={`ingredients[${i}].amount`}
                            label="Amount"
                            component={TextField}
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Field
                            id={`ingredients[${i}].unit`}
                            name={`ingredients[${i}].unit`}
                            label="Unit"
                            component={CustomSelect}
                            value={values.ingredients[i].unit}
                            options={units}
                          />
                        </Grid>
                        {values.ingredients.length > 1 && (
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(i)}>
                              <Delete />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                    <Grid item>
                      <IconButton
                        onClick={() =>
                          arrayHelpers.push({
                            item: "",
                            amount: 0,
                            unit: "g",
                          })
                        }
                      >
                        <AddCircle />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
              />
              <FieldArray
                name="method"
                render={arrayHelpers => (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Method</Typography>
                    {values.method.map((method, i) => (
                      <Grid
                        container
                        spacing={2}
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${values.id}-method-${i}`}
                      >
                        <Grid item xs={10}>
                          <Field
                            fullWidth
                            id={`method[${i}]`}
                            name={`method[${i}]`}
                            label={`Step ${i + 1}`}
                            component={TextField}
                            multiline
                            rows={3}
                            onBlur={handleBlur}
                            onChange={handleChange}
                          />
                        </Grid>
                        {values.method.length > 1 && (
                          <Grid item xs={1}>
                            <IconButton onClick={() => arrayHelpers.remove(i)}>
                              <Delete />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                    <Grid item>
                      <IconButton onClick={() => arrayHelpers.push("")}>
                        <AddCircle />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Button fullWidth variant="contained" type="submit">Submit</Button>
                    </Grid>
                  </Grid>
                )}
              />
              {/* Errors: {JSON.stringify(errors, null, 2)}
              Values: {JSON.stringify(values, null, 2)} */}
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  )
})

export default AddRecipeForm
