
import React, { useState, useEffect } from 'react'
import { Button, Form, Grid, Loader } from "semantic-ui-react"
import { db, storage } from "../firebase/firebase"
import { useParams, useNavigate } from "react-router-dom"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'

const initialState = {
  name: "",
  email: "",
  info: "",
  
}
const AddEditUser = () => {
  const [data, setData] = useState(initialState);
  const { name, email, info,  } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setErors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);


      uploadTask.on("state_changed", (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
        switch (snapshot.state) {
          case 'paused':
            console.log("upload is pause")
            break;
          case 'running':
            console.log("upload is runing")
            break;
          default:
            break;
        }
      }, (error) => {
        console.log(error)
      },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }))
          }); 
        }
      );
    };
    file && uploadFile();
  }, [file]);


  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const validate = () => {
    let errors = {};
    if (!name) {
      errors.name = "name is requeried"
    }
    if (!email) {
      errors.email = "email is requeried"
    }
    if (!info) {
      errors.info = "info is requeried"
    }
    
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setErors(errors);
    setIsSubmit(true);
    await addDoc(collection(db, "users"), {
      ...data,
      timestamp: serverTimestamp()

    })
    navigate("/");
  };
  return (

    <div>
      <Grid centered verticalAlign='middle' columns="3" style={{ height: "80vh" }}>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <div>
              {isSubmit ? < Loader active inline="centered" size='huge' /> : (
                <>
                  <h2>add user</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Input
                      label="name"
                      error={errors.name ? { content: errors.name } : null}
                      placeholder="entyer name"
                      name="name"
                      onChange={handleChange}
                      value={name}
                      AutoFocus />

                    <Form.Input
                      label="email"
                      error={errors.email ? { content: errors.email } : null}
                      placeholder="entyer email"
                      name="email"
                      onChange={handleChange}
                      value={email} />

                    <Form.TextArea
                      label="info"
                      error={errors.info ? { content: errors.info } : null}
                      placeholder="enter info"
                      name="info"
                      onChange={handleChange}
                      value={info} />

                    
                    <Form.Input
                      label="upload"
                      type='file'
                      onChange={(e) => setFile(e.target.files[0])}
                    />

                    <Button primary type='submit' disabled={progress !== null && progress < 100} >submit</Button>
                  </Form>

                </>
              )}
            </div>

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default AddEditUser