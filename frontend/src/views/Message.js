import React from 'react';
import './style/Msg.css';
import { useState, useEffect } from 'react';
import useAxios from '../utils/useAxios';
import { jwtDecode } from 'jwt-decode';
import { Link,  useNavigate } from 'react-router-dom';
import moment from 'moment';

function Message() {
  const baseURL = 'http://127.0.0.1:8000/api';
  const [messages, setMessages] = useState([]);
  let [newSearch, setNewSearch] = useState({ search: '' });

  const axios = useAxios();
  const token = localStorage.getItem('authTokens');
  const decoded = jwtDecode(token);
  const user_id = decoded.user_id;
  const username = decoded.username;
  const history = useNavigate();

  useEffect(() => {
    try {
      axios.get(baseURL + '/my-messages/' + user_id + '/').then((res) => {
        setMessages(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  
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

  const handelForm = () => {
    history('/profile');
  }

  return (
    <div>
      <main className="content">
        <div className="container-fluid h-100">
          <div className="card h-100">
            <div className="row g-0">
              <div className="col-lg-5 col-xl-3 border-end" style={{ maxHeight: 'calc(150vh - 72px)', overflowY: 'auto', backgroundColor: '#f0f0f0' }} >
                <div className="px-4">
                  <div className="d-flex align-items-center mt-2">
                    <input
                      type="text"
                      className="form-control my-3"
                      placeholder="Search..."
                      onChange={handleSearchChange}
                      name="username"
                    />
                    <button
                      className="btn btn-primary"
                      onClick={SearchUser}
                    >
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                {messages.map((message) => (
  <Link
    to={`/inbox/${
      message.sender.id === user_id
        ? message.reciever.id
        : message.sender.id
    }/`}
    className="list-group-item list-group-item-action border-0" 
    key={message.id}
  >
    <small>
      <div className="badge bg-success float-end">
        {moment
          .utc(message.date)
          .local()
          .startOf('seconds')
          .fromNow()}
      </div>
    </small>
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
        {message.sender.id !== user_id &&
          message.sender.username}
        <div className="small">
          <small>{message.message}</small>
        </div>
      </div>
    </div>
  </Link>
))}

              </div>
              <div className="col-lg-7 col-xl-9 d-flex flex-column">
                <div className="sticky-top">
                  <div className="py-2 px-4 border-bottom d-none d-lg-block">
                    <div className="d-flex align-items-center py-1">
                      <div className="position-relative">
                         
                      </div>
                      <div className="flex-grow-1 pl-3">
                        <strong></strong>
                        <div className="text-muted small">
                          <em></em>
                        </div>
                      </div>
                      <div>
                         
                        <button
                          onClick={handelForm}
                          className='btn btn-danger btn-lg me-1'>profile</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="position-relative flex-grow-1 overflow-auto">
                  <div className="chat-messages p-4" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                    {/* Chat messages */}
                  </div>
                </div>
                <div className="py-3 px-4 border-top">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message"
                    />
                    <button className="btn btn-primary">Send</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Message;