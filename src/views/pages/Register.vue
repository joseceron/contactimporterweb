<template>
  <div class="c-app d-flex align-items-center min-vh-100" :class="{ 'c-dark-theme': $store.state.darkMode }">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Register</h1>
                <b-row v-if="error">
                    <b-col cols="12">
                      <div class="alert alert-danger" role="alert" v-for="error_message in errors">
                        {{error_message}}
                      </div>
                    </b-col>
                </b-row>
                <p class="text-muted">Create your account</p>

                 <b-row>
                  <b-col md="12">                   
                    <b-input-group class="mb-3">
                      <b-input-group-prepend>
                        <b-input-group-text>@</b-input-group-text>
                      </b-input-group-prepend>
                      <b-form-input 
                        type="text"                          
                        placeholder="Email" 
                        autocomplete="email" 
                        v-model.trim="$v.email.$model"
                        :class="{'form-control is-invalid': $v.email.$error,
                          'form-control is-valid': !$v.email.$invalid}"/>
                      <b-form-invalid-feedback v-if="!$v.email.required">
                        Your email is required
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!$v.email.email">
                        Your email is not valid
                      </b-form-invalid-feedback>
                    </b-input-group>
                   
                  </b-col> 

                  <b-col lg="12">
                    <b-input-group class="mb-3">
                      <b-input-group-prepend>
                        <b-input-group-text>
                          <CIcon name="cil-lock-locked"/>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <b-form-input 
                        type="password"                          
                        placeholder="Password"                         
                        v-model.trim="$v.password.$model"
                        :class="{'form-control is-invalid': $v.password.$error,
                          'form-control is-valid': !$v.password.$invalid}"/>
                      <b-form-invalid-feedback v-if="!$v.password.required">
                        The password is required.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!$v.password.minLength">
                        The password has to have at least {{$v.password.$params.minLength.min}} characters.
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-col>
                  
                  <b-col lg="12">
                    <b-input-group class="mb-3">
                      <b-input-group-prepend>
                        <b-input-group-text>
                          <CIcon name="cil-lock-locked"/>
                        </b-input-group-text>
                      </b-input-group-prepend>
                      <b-form-input 
                        type="password"                          
                        placeholder="Repeat password"                         
                        v-model.trim="$v.password_confirmation.$model"
                        :class="{'form-control is-invalid': $v.password_confirmation.$error,
                          'form-control is-valid': !$v.password_confirmation.$invalid}"/>
                      <b-form-invalid-feedback v-if="!$v.password_confirmation.required">
                        Password confirmation is required
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!$v.password_confirmation.minLength">
                        Password confirmation has to have at least {{$v.password.$params.minLength.min}} characters.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!$v.password_confirmation.sameAsPassword">
                        The 2 passwords must be the same
                      </b-form-invalid-feedback>
                    </b-input-group>
                  </b-col>
                </b-row>
                               
                <CButton 
                  @click="submit"
                  color="success" 
                  block>Create Account
                </CButton>
              </CForm>
            </CCardBody>
           
             <hr>
          
            <b-list-group flush style="border-color:white;">
              <b-list-group-item>
                Do you already have an account?
                <button
                  type="button"
                  class="btn btn-link text-link-color"
                  style="padding-top:0px; padding-left:0"
                  @click.prevent="goTo('login')">
                  Go to Login
                </button>
              </b-list-group-item>
            </b-list-group>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
export default {
  name: 'Register',
  data(){
    return {
      error: false,
      errors: [],
      email: '',
      password: '',
      password_confirmation: '',

    }
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
      minLength: minLength(3)
    },
    password_confirmation: {
      required,
      minLength: minLength(3),
      sameAsPassword: sameAs('password') 
    },
  },
  methods: {
    submit () {
      this.$v.$touch()
      if (this.$v.$invalid) {                
        this.error = true
        this.errors = ['The form has some errors']                
      } else {        
        this.signup()
      }
    },
    signup: async function() {
      this.error = false
      this.errors = []
      try {
          let response = await this.$firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            if ('user' in response){
              var user = response.user;
              var token = await user.getIdToken()
              var userId = user.uid
              this.$store.commit('defUserId', userId)
              this.$router.push('/dashboard')
            } else {
                this.error = true                  
                this.errors.push('The signup was not completed')
            }
      } catch (error) {   
        this.error = true
        if (error != null && 'code' in error){
          if (error.code == 'auth/email-already-in-use'){
            this.errors.push('This email is already in use')
          } else if (error.code == 'auth/weak-password'){
            this.errors.push('Improve your password, at least 3 characters')
          } else if (error.code == 'auth/invalid-email'){
            this.errors.push('Invalid Email')
          } else {                
              this.errors.push('The signup was not completed')
              this.errors.push(error)
          }
        } else {            
          this.errors.push('The signup was not completed')
          this.errors.push(error)
        }
      }
    },
   
  }
}
</script>
