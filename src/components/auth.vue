<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="448"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="btn mx-6"
          small
          v-bind="props"
        >
          <span >Generate token</span>
        </v-btn>
      </template>
      <v-card
      class="mx-auto"
      elevation="8"
      max-width="448"
      rounded="lg"
      >
        <v-card-title class="d-flex px-6">
          <div class="text-h6">Generate token</div>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="dialog = false" size="x-small"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-1 text-medium-emphasis">Email*</div>

                <v-text-field
                  required
                  clearable
                  density="compact"
                  placeholder="Email address"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  hide-details
                  v-model="user.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                  Password

                  <a
                    class="text-caption text-decoration-none text-blue"
                    href="https://app.dev.resights.dk/reset-password"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Forgot login password?</a>
                </div>
                <v-text-field
                  required
                  clearable
                  :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="visible ? 'text' : 'password'"
                  density="compact"
                  placeholder="Enter your password"
                  prepend-inner-icon="mdi-lock-outline"
                  variant="outlined"
                  hide-details
                  @click:append-inner="visible = !visible"
                  v-model="user.password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="showMessageInWindow">
                <div class="text-medium-emphasis text-caption grey-bg">
                  <b class="l-blue">Warning:</b> After 3 consecutive failed login attempts,
                  you account will be temporarily
                  locked for three hours. If you must login now,
                  you can also click "Forgot login password?"
                  below to reset the login password.
                </div>
              </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="px-6 py-4">
          <v-spacer></v-spacer>
          <v-btn
            block
            class="btn"
            :loading="loading"
            @click="auth()"
          >
            <span>Generate token</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="showErrorMessage"
      timeout="3000"
    >
      <span>{{ ErrorMessage }}</span>
      <template v-slot:actions>
        <v-btn
          color="blue"
          variant="text"
          @click="showErrorMessage = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getToken } from '@/components/ai.api.js'
import {mapMutations} from "vuex";

export default defineComponent({
    data: () => ({
      dialog: false,
      showErrorMessage: false,
      showMessageInWindow: false,
      ErrorMessage: '',
      loading:false,
      visible:false,

      user: {
      email: null,
      password: null,
      remember_me: false
    },
    }),
    emits: ['update-token'],
    methods: {
      ...mapMutations(['updateToken']),
      async auth() {
          this.showErrorMessage = false
          this.loading = true
          const response= await getToken(this.user)
          if(response.status_code !== 200) {
            this.showErrorMessage = true
            this.showMessageInWindow = true
            this.ErrorMessage = response.message
          } else {
          localStorage.setItem('token', response.data.token)
          this.updateToken(response.data.token)
          this.dialog = false
        }
        this.loading = false
      }
    }
  })
</script>
<style scoped lang="scss">
.btn{
  border-radius: 0.3rem;
  background: #1A56FF;
  padding: 0.8rem 1.5rem;
  display: flex;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-transform: none;
  span {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #FAFAFA !important;
    }
}
.grey-bg{
  padding: 12px;
  background: #e8f0fe87;
  border-radius: 10px;
}
.l-blue{
  color: #1A56FF;
}
</style>

