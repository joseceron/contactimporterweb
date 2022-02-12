<template>
  <div
    class="c-app flex-row align-items-center"
    :class="{ 'c-dark-theme': $store.state.darkMode }"
  >
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                   <b-row v-if="error">
                      <b-col cols="12">
                          <div 
                            class="alert alert-danger" 
                            role="alert" 
                            v-for="error_message in errors">
                              {{error_message}}
                          </div>
                      </b-col>
                    </b-row>
                  <CInput 
                    placeholder="Email" 
                    autocomplete="username email" 
                    v-model="email">
                    <template #prepend-content
                      ><CIcon name="cil-user"
                    /></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model="password"
                  >
                    <template #prepend-content
                      ><CIcon name="cil-lock-locked"
                    /></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <b-button 
                        color="primary" 
                        class="px-4"
                        v-on:click="login">Login</b-button>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <!-- <CButton color="link" class="px-0"
                        >Forgot password?</CButton
                      > -->
                      <CButton color="link" class="d-lg-none"
                        >Register now!</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
             
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Sign up</h2>
                <p>Create a new account</p>
                <CButton 
                  color="light" 
                  variant="outline" 
                  size="lg"
                  @click="visitSignUp">
                  Register Now!
                </CButton>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      error: false,
      redirect: null,
      errors: [],
    }
  },
  methods: {
    login: async function() {
      
      try{
        this.error = false
        this.errors = []
        let response = await this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        
        if ('user' in response){
          var user = response.user;
          var token = await user.getIdToken()
          var userId = user.uid
          this.$store.commit('defUserId', userId)
          let userIdBd = this.$store.getters.userId;
          this.redirectLogin()
        } else { 
          this.error = true
          this.errors.push('Login failed, please try again later')
        }
      } catch (error){
        this.error = true
        if (error != null && 'code' in error){
          if (error.code == 'auth/invalid-email'){
              this.errors.push('Invalid email')
          } else if (error.code == 'auth/wrong-password'){
              this.errors.push('Invalid password')
          } else if(error.code == 'auth/user-not-found'){
            this.errors.push('User not found')
          }
          else {
              this.errors.push('Login failed, please try again later.')
          }
        } else{ 
          this.errors.push('Login failed, please try again later')
        }
      }
    }, 
    redirectLogin(){
      this.$router.replace('/dashboard')
    },
    visitSignUp(){
      this.$router.replace('/pages/register')
    },
  }
}
</script>
