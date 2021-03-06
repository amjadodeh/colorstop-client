import React, { Component } from 'react';
import Context from '../Context';

import { API_BASE_URL } from '../config';
import './SignInForm.css';

export class SignInPage extends Component {
  static contextType = Context;

  state = {
    signIn: {
      username: '',
      password: '',
    },
    showPassword: false,
    usernameError: '',
    passwordError: '',
  };

  validateSignIn() {
    const { username, password } = this.state.signIn;
    // const { users = [] } = this.context;

    if (!username || !password) {
      return this.setState({
        usernameError: 'Please enter your username and password',
      });
    }

    return true;
  }

  handleShowPassword = (e) => {
    e.preventDefault();
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  handleChangeSignIn = (e) => {
    this.setState({
      signIn: { ...this.state.signIn, [e.target.name]: e.target.value },
    });
  };

  handleClickSignIn = (e) => {
    e.preventDefault();
    if (this.validateSignIn()) {
      const username = this.state.signIn.username;
      const password = this.state.signIn.password;

      const user = this.context.users.find(
        (user) => user.username === username
      );

      if (user) {
        fetch(`${API_BASE_URL}/users/signingIn/${user.id}`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ password }),
        })
          .then((res) => {
            if (!res.ok) return res.json().then((e) => Promise.reject(e));
            return res.json();
          })
          .then((response) => {
            if (response) {
              this.context.handleSignInUser(user);
              this.context.handleShowSignIn();
            }
          })
          .catch((error) => {
            console.error({ error });
            this.setState({
              usernameError: 'Incorrect password',
            });
          });
      } else {
        this.setState({
          usernameError: 'This user does not exist',
        });
      }
    }
  };

  render() {
    return (
      <>
        <h2>Sign In</h2>

        <form className="signin-form">
          <div className="signin-form-username-div">
            <input
              className="signin-form-username-input"
              value={this.state.signIn.username}
              onChange={this.handleChangeSignIn}
              placeholder="Username"
              type="text"
              name="username"
              id="username"
            />
          </div>
          <div className="signin-form-password-div">
            <input
              className="signin-form-password-input"
              value={this.state.signIn.password}
              onChange={this.handleChangeSignIn}
              placeholder="Password"
              type={this.state.showPassword ? 'text' : 'password'}
              name="password"
              id="password"
            />
            <button
              className="signin-form-password-show-button"
              type="button"
              onClick={this.handleShowPassword}
            >
              {this.state.showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <span className="signin-form-error">{this.state.usernameError}</span>
          <span className="signin-form-error">{this.state.passwordError}</span>
          <button
            className="signin-form-submit-button"
            onClick={this.handleClickSignIn}
            type="submit"
          >
            Sign In
          </button>
        </form>
      </>
    );
  }
}

export default SignInPage;
