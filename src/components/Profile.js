import React, { Component } from 'react'
import axios from 'axios';
import { FormErrors } from '../reducers/FormErrors';
import { Row, Col, Container, Navbar, Nav, NavDropdown, button } from 'react-bootstrap';

export default class Profile extends Component {
    constructor(props) {
        super(props)
        const udata = localStorage.getItem('user')
        const odata = JSON.parse(udata)
        
        this.handleUserInput = this.handleUserInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            user : odata.user,
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            password: '',
            password_confirmation: '',
            formErrors: { first_name: '', last_name: '', phone: '', password: '', password_confirmation: '' },
            first_nameValid: false,
            last_nameValid: false,
            phoneValid: false,
            emailValid: false,
            passwordValid: false,
            password_confirmationValid: false,
            formValid: false,
            dataError: null,
        }
    }
    
    handleUserInput (e) {
      const name = e.target.name;
      const value = e.target.value;
      this.setState({[name]: value}, 
                    () => { this.validateField(name, value) });
    }   
    errorClass(error) {
       //return(error.length === 0 ? '' : 'has-error');
    }
    validateField(fieldName, value) {
          let fieldValidationErrors = this.state.formErrors;
          let phoneValid = this.state.phoneValid;
          let passwordValid = this.state.passwordValid;
          let password_confirmationValid = this.state.password_confirmation;

          switch(fieldName) {
            case 'phone':
              phoneValid = value.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im);
              fieldValidationErrors.phone = phoneValid ? '': 'Phone is invalid.';
              break;
            case 'password':
              passwordValid = value.length >= 5;
              fieldValidationErrors.password = passwordValid ? '': 'Password is too short.';
              break;
            case 'password_confirmation':
                passwordValid = passwordValid != password_confirmationValid;
                fieldValidationErrors.password_confirmation = passwordValid ? '': 'Please enter password in both fields.';
            default:
              break;
          }
          this.setState({formErrors: fieldValidationErrors,
                          passwordValid: passwordValid,
                          password_confirmationValid: password_confirmationValid,
                        }, this.validateForm);
        }
        validateForm() {
          this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.password_confirmation});
        }
    onSubmit(e) {
        e.preventDefault()
        const userObject = {
            first_name: (this.state.first_name) ? this.state.first_name : this.state.user.first_name,
            last_name: (this.state.last_name) ? this.state.last_name : this.state.user.last_name,
            phone: (this.state.phone) ? this.state.phone : this.state.user.phone,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation,
        };
        //Here email used but this can be done with ID...
        axios.post('http://127.0.0.1:8000/api/auth/update/'+this.state.user.email, userObject)
            .then((res) => {
                if(res.data.status === 1){
                    alert(res.data.message)
                    const userdata = localStorage.getItem('user')
                    const details = JSON.parse(userdata)
                    details.user = res.data.user;
                    console.log(details);
                    localStorage.setItem('user', JSON.stringify(details));
                    this.setState({ first_name: '', last_name: '', phone: '', password: '', password_confirmation: '' })
                    window.location.reload();
                }
            }).catch((error) => {
                if(error){
                    let ErrorDetails = JSON.parse(error.response.data);
                    this.setState({
                        formValid: false,
                        formErrors:ErrorDetails,
                      });
                }
            });
    }
  render() {
    return (
        <div className='App'>
            <div className="auth-wrapper signUp">
              <div className="auth-inner">
              <form onSubmit={this.onSubmit} >
                <h3>Update Your Details</h3>
                <div className="text-danger">
                 <FormErrors formErrors={this.state.formErrors} />
                </div>
                <Container>
                    <Row>
                    <Col md={6} className="p-10">
                        <div className="mb-3 text-align-left">
                          <label htmlFor="first_name">First name</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="First name"
                            maxLength="20"
                            onChange={(event) => this.handleUserInput(event)}
                            name="first_name"
                            value={(this.state.first_name) ? this.state.first_name : this.state.user.first_name}
                          />
                          </div>
                    </Col>
                    <Col md={6} className="p-10">
                        <div className="mb-3">
                          <label className="text-align-left" htmlFor="last_name">Last name</label>
                          <input 
                           type="text"
                           className="form-control" 
                           placeholder="Last name" 
                           onChange={(event) => this.handleUserInput(event)}
                           name="last_name"
                           maxLength="20"
                           value={(this.state.last_name) ? this.state.last_name : this.state.user.last_name} 
                           />
                        </div>
                    </Col>
                    </Row>
                    <Row>
                    <Col md={6} className="p-10">
                        <div className="mb-3 text-align-left">
                          <label htmlFor="phone">Phone Number</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter phone number"
                            onChange={(event) => this.handleUserInput(event)}
                            name="phone"
                            value={(this.state.phone) ? this.state.phone : this.state.user.phone}            
                          />
                        </div>
                    </Col>
                    <Col md={6} className="p-10">
                        <div className="mb-3 text-align-left">
                          <label htmlFor="email">Email address</label>
                          <input
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            disabled
                            name="email"
                            value={this.state.user.email}
                          />
                        </div>
                    </Col>
                    </Row>
                    <Row>
                    <Col md={6} className="p-10">
                       <div className="mb-3 text-align-left">
                          <label htmlFor="password">Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={(event) => this.handleUserInput(event)}
                            name="password"
                            minLength="5"
                            value={this.state.password}
                          />
                       </div>
                    </Col>
                    <Col md={6} className="p-10">
                        <div className="mb-3 text-align-left">
                          <label htmlFor="password_confirmation">Confirm Password</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={(event) => this.handleUserInput(event)}
                            name="password_confirmation"
                            minLength="5"
                            value={this.state.password_confirmation}
                          />
                        </div>
                    </Col>
                    </Row>
                    <Row md={12}>
                        <Col md={2} className="p-10">
                            <div className="d-grid">
                              <button type="submit" className="btn btn-primary" >
                                Update
                              </button>
                            </div>
                        </Col>
                    </Row>
                </Container>
                </form>
              </div>
            </div>
         </div>
    )
  }
}