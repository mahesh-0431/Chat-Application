import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import './style/Message.css';
import useAxios from '../utils/useAxios';
import { jwtDecode } from 'jwt-decode';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import './style/Msg.css';

function MessageDetail() {
  const baseURL = 'http://127.0.0.1:8000/api';
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState([]);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);
  const [newMessage, setNewMessage] = useState({ message: '' });
  const [newSearch, setNewSearch] = useState({ search: '' });
  const [onlineStatus, setOnlineStatus] = useState('Offline');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [tokens, setToken] = useState(localStorage.getItem('authTokens')); // Added loading indicator for profile
   


  const axios = useAxios();
  const id = useParams();
  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const username = decoded.username;
  const history = useNavigate();



  const refreshToken = () => {
    try {
      axios.post(baseURL + '/token/refresh/', { refresh_token: token.refresh_token })
        .then((res) => {
          localStorage.setItem('authTokens', res.data.access_token);
          setToken(res.data.access_token);
        })
        .catch((error) => {
          console.log('Error refreshing token:', error);
        });
    } catch (error) {
      console.log('Error refreshing token:', error);
    }
  };

  useEffect(() => {
    try {
      axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
        setMessages(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(baseURL + '/profile/' + id.id + '/');
        setProfile(response.data);
        setUser(response.data.user);
        setOnlineStatus(response.data.user.online ? 'Online' : 'Offline');
        setLoadingProfile(false); // Set loading indicator to false once profile is fetched
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [id.id]); // Update profile when id changes

  const handleUserClick = (userId) => {
    history(`/inbox/${userId}`);
  };

  // Get all messages for a conversation
  useEffect(() => {
    let interval = setInterval(() => {
      try {
        axios.get(baseURL + '/get-messages/' + user_id + '/' + id.id + '/').then((res) => {
          setMessage(res.data);
        });
      } catch (error) {
        console.log(error);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [id.id, user_id]);

  const handleChange = (event) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value,
    });
  };

  const SendMessage = () => {
    const formdata = new FormData();
    formdata.append('user', user_id);
    formdata.append('sender', user_id);
    formdata.append('reciever', id.id);
    formdata.append('message', newMessage.message);
    formdata.append('is_read', false);

    try {
      axios.post(baseURL + '/send-messages/', formdata).then((res) => {
        document.getElementById('text-input').value = '';
        setNewMessage({ message: '' });
      });
    } catch (error) {
      console.log('error ===', error);
    }
  };

  const handleSearchChange = (event) => {
    setNewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });
  };

  const SearchUser = () => {
    axios
      .get(baseURL + '/search/' + newSearch.username + '/')
      .then((res) => {
        if (res.status === 404) {
          console.log(res.data.detail);
          alert('User does not exist');
        } else {
          history('/search/' + newSearch.username + '/');
        }
      })
      .catch((error) => {
        alert('User Does Not Exist');
      });
  };

  const handleForm = () => {
    history('/profile');
  };

  return (
    <div>
      <main className="content">
        <Container fluid className="h-100">
          <Row className="h-100">
            <Col lg={5} xl={3} className="border-end" style={{ maxHeight: 'calc(150vh - 72px)',overflowY:'auto', backgroundColor: '#f0f0f0' }}>
              <div className="px-4">
                <div className='d-flex align-items-center'>
                  <div className="flex-grow-1 d-flex align-items-center mt-2">
                    <Form.Control
                      type="text"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      name="username"
                      style={{ borderRadius: '20px' }} // WhatsApp-like style
                    />
                    <Button
                      variant="primary"
                      onClick={SearchUser}
                      style={{ borderRadius: '50%' }} // WhatsApp-like style
                    >
                      <i className="fas fa-search"></i>
                    </Button>
                  </div>
                </div>
              </div>
              {messages.map((message) => (
                <div
                  onClick={() => handleUserClick(message.reciever.id === user_id ? message.sender.id : message.reciever.id)}
                  className="list-group-item list-group-item-action border-0"
                  key={message.id}
                >
                  <div className="d-flex align-items-start">
                    {message.sender.id !== user_id && message.sender_profile && ( // Check if sender_profile is not null
                      <img
                        src={message.sender_profile.image}
                        className="rounded-circle me-1"
                        alt="1"
                        width={40}
                        height={40}
                      />
                    )}
                    {message.sender.id === user_id && message.reciever_profile && ( // Check if receiver_profile is not null
                      <img
                        src={message.reciever_profile.image}
                        className="rounded-circle me-1"
                        alt="2"
                        width={40}
                        height={40}
                      />
                    )}
                    <div className="flex-grow-1">
                      {message.sender.id === user_id &&
                        (message.reciever_profile && message.reciever_profile.full_name !== null
                          ? message.reciever_profile.full_name
                          : message.reciever.username)}
                      {message.sender.id !== user_id && message.sender.username}
                      <div className="small">
                        <small>{message.message}</small>
                      </div>
                      <small>
                        <div className="badge bg-success float-end">
                          {moment.utc(message.date).local().startOf('seconds').fromNow()}
                        </div>
                      </small>
                    </div>
                  </div>
                </div>
              ))}
              <hr className="d-block d-lg-none mt-1 mb-0" />
            </Col>
            <Col lg={7} xl={9} className="d-flex flex-column">
              <div className="py-2 px-4 border-bottom d-none d-lg-block">
                <div className="d-flex align-items-center py-1">
                  <div className="position-relative">
                    {loadingProfile ? (
                      <div>Loading...</div>
                    ) : (
                      <img
                        src={profile.image}
                        className="rounded-circle me-1"
                        alt=""
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                  <div className="flex-grow-1 pl-3">
                    <strong>{loadingProfile ? 'Loading...' : profile.full_name}</strong>
                    <div className="text-muted small">
                      <em>{onlineStatus}</em>
                    </div>
                  </div>
                  <div>
                    <Button variant="danger" className="btn-lg me" onClick={handleForm}>
                      Profile
                    </Button>
                  </div>
                </div>
              </div>
              <div className="position-relative flex-grow-1 " style={{ maxHeight: 'calc(100vh - 180px)' }}>
                <div className="chat-messages p-4">
                  {message.map((message, index) => (
                    <>
                      {message.sender.id !== user_id && (
                        <div className="chat-message-left pb-4" key={index}>
                          <div>
                            <img
                              src={message.sender_profile.image}
                              className="rounded-circle mr-1"
                              alt="Chris Wood"
                              style={{ objectFit: 'cover' }}
                              width={40}
                              height={40}
                            />
                            <br />
                            <div className="text-muted small text-nowrap mt-2">
                              {moment.utc(message.date).local().startOf('seconds').fromNow()}
                            </div>
                            <div className="text-muted small text-nowrap mt-2"></div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                            <div className="font-weight-bold mb-1">{message.sender_profile.full_name}</div>
                            {message.message}
                          </div>
                        </div>
                      )}
                      {message.sender.id === user_id && (
                        <div className="chat-message-right pb-4" key={index}>
                          <div>
                            <img
                              src={message.sender_profile.image}
                              className="rounded-circle mr-1"
                              alt="{message.reciever_profile.full_name}"
                              style={{ objectFit: 'cover' }}
                              width={40}
                              height={40}
                            />
                            <br />
                            <div className="text-muted small text-nowrap mt-2">
                              {moment.utc(message.date).local().startOf('seconds').fromNow()}
                            </div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                            <div className="font-weight-bold mb-1">you</div>
                            {message.message}
                          </div>
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </div>
              <div className="py-3 px-4 border-top sticky-bottom">
                <InputGroup className="flex-grow-1">
                  <Form.Control
                    type="text"
                    placeholder="Type your message"
                    value={newMessage.message}
                    name="message"
                    id="text-input"
                    onChange={handleChange}
                  />
                  <Button onClick={SendMessage} variant="primary">
                    Send
                  </Button>
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
}

export default MessageDetail;