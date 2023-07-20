<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      width="724"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          tonal
          v-bind="props"
        >
          Generate Token
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5"> Generate Token</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Email*"
                  required
                  v-model="user.email"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password*"
                  type="password"
                  required
                  v-model="user.password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="auth()"
          >
            Generate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { getToken } from '@/components/ai.api.js'
import {mapMutations} from "vuex";

export default defineComponent({
    data: () => ({
      dialog: false,
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
        const {data}= await getToken(this.user)
        localStorage.setItem('token', data.token)
        this.updateToken(data.token)
      }
    }
  })
</script>
