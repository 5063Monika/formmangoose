import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  FormHelperText
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function Fullform1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    hobbies: [],
    country: "",
    state: "",
    message: "",
    date: "",
    file: null,
    accept: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const stateData = {
    India: ["Tamil Nadu", "Kerala", "Karnataka"],
    USA: ["California", "Texas", "Florida"],
    Germany: ["Berlin", "Hamburg", "Munich"]
  };

  const hobbiesList = ["Reading", "Sports", "Music", "Traveling", "Cooking"];

  // VALIDATION
  const validate = (name, value) => {
    switch (name) {
      case "name":
        if (!value) return "Name required";
        if (value.length < 3) return "Min 3 characters";
        return "";

      case "email":
        if (!value) return "Email required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email";
        return "";

      case "password":
        if (!value) return "Password required";
        if (value.length < 6) return "Min 6 chars";
        return "";

      case "phone":
        if (!/^[0-9]{10}$/.test(value)) return "Invalid phone";
        return "";

      case "age":
        if (!value || value < 18) return "Min age 18";
        return "";

      case "gender":
        return value ? "" : "Select gender";

      case "country":
        return value ? "" : "Select country";

      case "state":
        return value ? "" : "Select state";

      case "message":
        if (!value) return "Required";
        if (value.length < 10) return "Min 10 chars";
        return "";

      case "date":
        return value ? "" : "Select date";

      case "file":
        return value ? "" : "Upload file required";

      case "accept":
        return value ? "" : "Accept terms required";

      default:
        return "";
    }
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let updated = { ...formData };

    if (type === "checkbox" && name === "accept") {
      updated.accept = checked;
    } else if (type === "checkbox") {
      updated.hobbies = checked
        ? [...formData.hobbies, value]
        : formData.hobbies.filter((h) => h !== value);
    } else if (type === "file") {
      updated.file = files[0];
    } else {
      updated[name] = value;
    }

    setFormData(updated);

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, updated[name])
    }));
  };

  // BLUR
  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, formData[name])
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const newTouched = {};

    Object.keys(formData).forEach((key) => {
      newErrors[key] = validate(key, formData[key]);
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post("http://localhost:5000/upload", data);

      alert("Submitted Successfully ✅");

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        age: "",
        gender: "",
        hobbies: [],
        country: "",
        state: "",
        message: "",
        date: "",
        file: null,
        accept: false
      });

      setErrors({});
      setTouched({});
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  return (
    <Box sx={{ width: 500, margin: "auto", mt: 3 }}>

      {/* FIXED TYPOGRAPHY */}
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Student Form
      </Typography>

      {/* NAME */}
      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && !!errors.name}
        helperText={touched.name && errors.name}
      />

      {/* EMAIL */}
      <TextField
        label="Email"
        name="email"
        fullWidth
        margin="normal"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email && !!errors.email}
        helperText={touched.email && errors.email}
      />

      {/* PASSWORD */}
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password && !!errors.password}
        helperText={touched.password && errors.password}
      />

      {/* PHONE */}
      <TextField
        label="Phone"
        name="phone"
        fullWidth
        margin="normal"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.phone && !!errors.phone}
        helperText={touched.phone && errors.phone}
      />

      {/* AGE */}
      <TextField
        label="Age"
        name="age"
        type="number"
        fullWidth
        margin="normal"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.age && !!errors.age}
        helperText={touched.age && errors.age}
      />

      {/* GENDER */}
      <Typography>Gender</Typography>
      <RadioGroup row name="gender" onChange={handleChange}>
        <FormControlLabel value="Male" control={<Radio />} label="Male" />
        <FormControlLabel value="Female" control={<Radio />} label="Female" />
      </RadioGroup>
      {touched.gender && errors.gender && (
        <FormHelperText error>{errors.gender}</FormHelperText>
      )}

      {/* HOBBIES */}
      <Typography>Hobbies</Typography>
      <FormGroup row>
        {hobbiesList.map((h) => (
          <FormControlLabel
            key={h}
            control={
              <Checkbox
                value={h}
                checked={formData.hobbies.includes(h)}
                onChange={handleChange}
              />
            }
            label={h}
          />
        ))}
      </FormGroup>

      {/* COUNTRY */}
      <FormControl fullWidth margin="normal" error={touched.country && !!errors.country}>
        <InputLabel>Country</InputLabel>
        <Select
          name="country"
          value={formData.country}
          onChange={handleChange}
        >
          {Object.keys(stateData).map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
        {touched.country && errors.country && (
          <FormHelperText>{errors.country}</FormHelperText>
        )}
      </FormControl>

      {/* STATE */}
      <FormControl fullWidth margin="normal" error={touched.state && !!errors.state}>
        <InputLabel>State</InputLabel>
        <Select
          name="state"
          value={formData.state}
          onChange={handleChange}
        >
          {(stateData[formData.country] || []).map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
        {touched.state && errors.state && (
          <FormHelperText>{errors.state}</FormHelperText>
        )}
      </FormControl>

      {/* MESSAGE */}
      <TextField
        label="Message"
        name="message"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.message && !!errors.message}
        helperText={touched.message && errors.message}
      />

      {/* DATE */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={formData.date ? dayjs(formData.date) : null}
          onChange={(value) => {
            const dateValue = value ? value.format("YYYY-MM-DD") : "";

            setFormData({ ...formData, date: dateValue });

            setTouched((prev) => ({ ...prev, date: true }));

            setErrors((prev) => ({
              ...prev,
              date: validate("date", dateValue)
            }));
          }}
        />
      </LocalizationProvider>

      {touched.date && errors.date && (
        <FormHelperText error>{errors.date}</FormHelperText>
      )}

      {/* FILE */}
      <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
        Upload File
        <input type="file" hidden name="file" onChange={handleChange} />
      </Button>

      {touched.file && errors.file && (
        <FormHelperText error>{errors.file}</FormHelperText>
      )}

      {/* ACCEPT */}
      <FormControl error={touched.accept && !!errors.accept}>
        <FormControlLabel
          control={
            <Checkbox
              name="accept"
              checked={formData.accept}
              onChange={handleChange}
            />
          }
          label="Accept Terms"
        />
        {touched.accept && errors.accept && (
          <FormHelperText>{errors.accept}</FormHelperText>
        )}
      </FormControl>

      {/* SUBMIT */}
      <Button
        onClick={handleSubmit}
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
      >
        Submit
      </Button>

    </Box>
  );
}

export default Fullform1;