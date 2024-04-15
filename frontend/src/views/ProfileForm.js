import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import { jwtDecode } from 'jwt-decode';
import { Container, Row, Col } from 'react-bootstrap';
import './style/ProfileForm.css';

function ProfileForm() {
    const baseURL = 'http://127.0.0.1:8000/api';
    const [profile, setProfile] = useState({});
    const [editedFullName, setEditedFullName] = useState('');
    const [editedUserId, setEditedUserId] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // For previewing the updated profile picture
    const [successMessage, setSuccessMessage] = useState('');
    const history = useNavigate();
    const axios = useAxios();
    const id = useParams();
    const token = localStorage.getItem('authTokens');
    const decoded = jwtDecode(token);
    const user_id = decoded.user_id;

    useEffect(() => {
        if (user_id) {
            axios.get(`${baseURL}/profile/${user_id}/`)
                .then((res) => {
                    if (res.data) {
                        setProfile(res.data);
                        setEditedFullName(res.data.full_name);
                        setEditedUserId(res.data.user);
                        if (res.data.image) {
                            setProfileImage(res.data.image);
                        }
                    } else {
                        console.error('Profile data not found in response');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, [user_id]);

    const handleFullNameChange = (e) => {
        setEditedFullName(e.target.value);
    };

    const handleUserIdChange = (e) => {
        setEditedUserId(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file)); // Create a preview URL for the updated profile picture
    };

    const saveChanges = () => {
        const formData = new FormData();
        formData.append('full_name', editedFullName);
        formData.append('user', editedUserId);
        if (profileImage) {
            formData.append('image', profileImage);
        }

        axios.put(`${baseURL}/profile/${user_id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((res) => {
                console.log('Profile updated successfully');
                setSuccessMessage('Profile updated successfully');
            })
            .catch((error) => {
                console.error('Error updating profile:', error);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('authTokens');
        history('/login');
    };

    return (
        <Container className="profile-container border border-primary rounded box p-1 mt-1">
            <Row>
                <Col>
                    <h1 className='text-center'>Edit Profile</h1>
                    <button className='ml-3' onClick={() => history('/Msg')}>
                        <img src="./images/left2.png" alt="left arrow" className='left' style={{ width: '50px', height: '50px' }} />
                    </button>
                </Col>
            </Row>
            <Row>
                <Col xs={{ span: 10, offset: 1 }} 
                    className="profile-picture-container text-center">
                    <div className="profile-picture-frame">
                        {(profileImage || previewImage) && <img src={previewImage || profileImage} alt="Profile" className="profile-picture" />}
                    </div>
                    <div>
                        <label>Full Name:</label><br/>
                        <input type="text" value={editedFullName} onChange={handleFullNameChange} />
                    </div>
                    <div>
                        <label>User ID:</label><br/>
                        <input type="text" value={editedUserId} onChange={handleUserIdChange} disabled />
                    </div>
                    <div>
                        <label>Profile Picture:</label><br/>
                        <input type="file" onChange={handleImageChange} />
                    </div><br/>
                    
                    <button className="btn-primary rounded p-1" onClick={saveChanges}>Save Changes</button><br /><br />
                    <button className="btn-danger rounded p-2" onClick={handleLogout}>Logout</button><br /><br />
                    {successMessage && <p className="success-message">{successMessage}</p>}
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileForm;