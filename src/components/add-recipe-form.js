import React, { useState } from "react"
import { Formik, Form, Field, FieldArray, useField } from "formik"
import { makeStyles, TextField, Paper, MenuItem } from "@material-ui/core"
import axios from "axios"
import * as Yup from "yup"
import PropTypes from "prop-types"

const useStyles = makeStyles(theme => ({
  paper: {
    padding: "2rem",
    position: "absolute",
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

  console.log(options.find(option => option.value === field.value))

  return (
    <TextField
      label={label}
      name={name}
      id={id}
      select
      value={options && options.find(option => option.value === field.value).value}
      onChange={option => helpers.setValue(option.target.value)}
      onBlur={field.onBlur}
    >
      {options.map(option => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
  )
}

const AddRecipeForm = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const [ingredientRows, setIngredientRows] = useState(1)

  const today = new Date()
  console.log(today.getDate())

  const initialValues = {
    title: "",
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
    method: [],
  }

  const schema = {
    title: Yup.string().required("Required"),
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
          console.log(values)
          setSubmitting(false)
        }}
      >
        {({ handleChange, handleBlur, errors, touched, values }) => (
          <Form>
            <Field
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
            <Field
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
            <FieldArray
              name="ingredients"
              render={arrayHelpers => (
                <>
                  {values.ingredients.map((ingredient, i) => (
                    <>
                      <Field
                        id={`ingredients[${i}].item`}
                        name={`ingredients[${i}].item`}
                        label="Item"
                        component={TextField}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <Field
                        id={`ingredients[${i}].amount`}
                        name={`ingredients[${i}].amount`}
                        label="Amount"
                        component={TextField}
                        type="number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <Field
                        id={`ingredients[${i}].unit`}
                        name={`ingredients[${i}].unit`}
                        label="Unit"
                        component={CustomSelect}
                        value={values.ingredients[i].unit}
                        options={units}
                      />
                    </>
                  ))}
                </>
              )}
            />
            {/* <TextField
            id="date"
            name="date"
            label="Date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
          />
          <TextField
            fullWidth
            multiline
            rows={5}
            id="description"
            name="description"
            label="Description"
            value={formik.values.description}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          /> */}
            {/* {[...Array(ingredientRows)].map((x, i) => (
            <div>
              <TextField
                id={`ingredient-${i}-item`}
                name={`ingredient-${i}-item`}
                label="Item"
                value={formik.values.ingredients[i].item}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={
                  formik.touched.ingredients[i].item &&
                  Boolean(formik.errors.ingredients[i].item)
                }
                helperText={
                  formik.touched.ingredients[i].item &&
                  formik.errors.ingredients[i].item
                }
              />
            </div>
          ))} */}
            Errors: {JSON.stringify(errors, null, 2)}
            Values: {JSON.stringify(values, null, 2)}
          </Form>
        )}
      </Formik>
    </Paper>
  )
})

export default AddRecipeForm
