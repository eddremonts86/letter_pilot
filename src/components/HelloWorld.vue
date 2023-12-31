<template>
  <v-container :fluid="seeMore">
    <v-responsive>
      <v-row
        class="d-flex pa-5"
        :class="{ seeMore, 'justify-center align-center': !seeMore }"
      >
        <v-col
          cols="12"
          :md="seeMore ? 6 : 12"
          class="d-flex align-center justify-center"
        >
          <v-card class="card maxWidth" rounded>
            <v-card-title>
              <h2>Letter pilot by Resights</h2>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="cardText">
              <div>
                <p>
                  Letter pilot is your writing assistant for generating content
                  for new letters on Resights. Upload an existing template and
                  choose the modifications that you would like and receive 3 new
                  versions of the existing template.
                </p>
                <p>
                  The new template will be unique to you and you are welcome to
                  use the text in a new template.
                </p>
              </div>
              <div class="prompt">
                <h3>Settings</h3>
                <QuillEditor
                  theme="snow"
                  v-model:content="existingMarketingCopy"
                  contentType="html"
                />
              </div>
              <div>
                <h4>Pick a tone of voice</h4>
                <v-radio-group v-model="toneValue" row>
                  <v-radio
                    v-for="item in tone"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </v-radio-group>
              </div>
              <div>
                <h4>Select variables</h4>
                <div
                  v-for="(item, key) in variablesList"
                  :key="key"
                  class="d-flex justify-start align-center checkboxSelect"
                >
                  <div class="mr-3">
                    <v-checkbox
                      hide-details
                      :key="item.value"
                      :value="item.value"
                      v-model="variablesSelected[item.value]"
                    />
                  </div>
                  <div
                    @click="addElement(item.value, variablesSelected)"
                    class="pointer contentText"
                  >
                    <p class="label">{{ item.label }}</p>
                    <p class="content">{{ item.content }}</p>
                  </div>
                </div>
              </div>
              <div class="prompt">
                <h3>Prompt</h3>
                <div>
                  <v-text-field
                    label="Temperature (0 - 2.0)"
                    type="number"
                    min="0"
                    max="2"
                    variant="outlined"
                    v-model="temperature"
                  ></v-text-field>
                </div>
                <div>
                  <QuillEditor
                    theme="snow"
                    v-model:content="promptText"
                    contentType="html"
                  />
                </div>
              </div>
              <v-divider class="mb-6" v-if="!seeMore" />
              <div v-if="!seeMore" class="prompt">
                <div class="d-flex justify-center align-center">
                  <h3>Result</h3>
                  <v-spacer />
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="#1A56FF"
                        @click="openSeeMorePanel()"
                      >
                        mdi-account-eye
                      </v-icon>
                    </template>
                    <span>See output</span>
                  </v-tooltip>
                </div>
                <QuillEditor
                  theme="snow"
                  v-model:content="output"
                  contentType="html"
                />
              </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn class="btn" @click="sendVariable()" :loading="loading">
                <span> Generate letter </span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          v-if="seeMore"
          class="d-flex align-start justify-start"
        >
          <v-card class="card full-size" rounded>
            <v-card-title class="d-flex">
              <h2>Result</h2>
              <v-spacer />
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    color="#1A56FF"
                    @click="openSeeMorePanel()"
                  >
                    mdi-account-eye
                  </v-icon>
                </template>
                <span>Hide output</span>
              </v-tooltip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <QuillEditor
                theme="snow"
                v-model:content="output"
                contentType="html"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-snackbar v-model="showError" timeout="3000">
        <span>Invalid Token, please generate a new token </span>
        <template v-slot:actions>
          <v-btn color="blue" variant="text" @click="showError = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import prompt from "@/components/prompt.js";
import { generatePromptResults } from "@/components/ai.api";
import { mapState } from "vuex";

interface Selected {
  [key: string]: any;
}

interface PromptType {
  header: string;
  userFullNameText?: string;
  cityText?: string;
  propertyTypeText?: string;
  daysForSaleText?: string;
  temperatureText?: string;
  existingCopyHeader?: string;
  existingCopyBody?: string;
  avoid?: string;
  incorporateVariablesText?: string;
}

interface VariablesSelectedType {
  full_name: string;
  city: string;
  property_type: string;
  days_for_sale: string;
  [key: string]: string
}

export default defineComponent({
  name: "HelloWorld",
  components: {
    QuillEditor,
  },

  data: () => ({
    toneValue: "funny",
    variablesSelected: {} as VariablesSelectedType,
    prompt: {} as PromptType,
    output: "",
    seeMore: true,
    loading: false,
    tone: [
      {
        value: "funny",
        label: "Funny",
      },
      {
        value: "professional",
        label: "Professional",
      },
      {
        value: "friendly",
        label: "Friendly",
      },
      {
        value: "engaging",
        label: "Engaging",
      },
    ],
    variablesList: [
      {
        value: "full_name",
        content: "Inserts the users full name",
        label: "Full name",
      },
      {
        value: "city",
        content:
          'Inserts “in” or “on” followed by the name of the city from the property address. For example "on Frederiksberg".',
        label: "City",
      },
      {
        value: "property_type",
        content:
          'Inserts the name of the property type. For example "villa" or "apartment".',
        label: "Property type",
      },
      {
        value: "days_for_sale",
        content:
          "Inserts the number of days the property has been for sale. For example “62”.",
        label: "Days for Sale",
      },
    ],
    temperature: 0.8,
    existingMarketingCopy: "",
    showError: false,
    authToken: {} as string | null,
  }),
  mounted() {
    this.prompt = prompt(this.toneValue, this.temperature);
    this.existingMarketingCopy = this.prompt.existingCopyBody ?? "";
    this.variablesSelected = {
      full_name: "full_name",
      city: "city",
      property_type: "property_type",
      days_for_sale: "days_for_sale",
    };
    this.authToken = localStorage.getItem("token");
  },
  watch: {
    toneValue: function (val) {
      this.prompt = prompt(val, this.temperature);
    },
    temperature: function (val) {
      this.prompt = prompt(this.toneValue, val);
    },
    token: function (val) {
      console.log("val: ", val);
      this.authToken = val;
    },
  },
  computed: {
    ...mapState({
      token: (state: any) => state.token,
    }),
    promptText() {
      const {
        header,
        propertyTypeText,
        daysForSaleText,
        cityText,
        userFullNameText,
        existingCopyHeader,
        avoid,
        incorporateVariablesText,
      } = this.prompt;

      let content = {
        openTag: "",
        fullName: "",
        city: "",
        incorporated: "",
        propertyType: "",
        daysForSale: "",
        closeTag: "",
      };

      let Result = {
        header,
        content: "",
        avoid,
        existingCopyHeader,
        existingCopyBody: this.existingMarketingCopy,
      };
      const variablesSelected = Object.keys(this.variablesSelected);

      if (variablesSelected.length) {
        content.openTag = "<ul>";
        content.incorporated = incorporateVariablesText ?? "";
      }
      if ("full_name" in this.variablesSelected) {
        content.fullName = userFullNameText ?? "";
      }
      if ("city" in this.variablesSelected) {
        content.city = cityText ?? "";
      }
      if ("property_type" in this.variablesSelected) {
        content.propertyType = propertyTypeText ?? "";
      }
      if ("days_for_sale" in this.variablesSelected) {
        content.daysForSale = daysForSaleText ?? "";
      }
      if (variablesSelected.length) {
        content.closeTag = "</ul>";
      }
      Result.content =
        content.incorporated +
        content.openTag +
        content.fullName +
        content.city +
        content.propertyType +
        content.daysForSale +
        content.closeTag;
      return Object.values(Result).join(" ");
    },
  },
  methods: {
    addElement(variable: string, variablesSelected: Selected) {
      if (variablesSelected[variable]) {
        delete variablesSelected[variable];
      } else {
        variablesSelected[variable] = variable;
      }
    },
    async sendVariable() {
      this.loading = true;
      this.output = "Generating...";
      const payload = {
        // style: this.toneValue,
        // letter: this.existingMarketingCopy,
        temperature: this.temperature,
        prompt: this.promptText,
      };
      const response = await generatePromptResults(payload, this.authToken);
      console.log("response: ", response);
      if (response.message) {
        this.output =
          "<b>Sorry we found an error, try again.</b>" +
          "- " +
          response.message;
        localStorage.setItem("token", "");
        this.showError = true;
      } else {
        this.output = response.response;
      }
      this.loading = false;
    },
    openSeeMorePanel() {
      this.seeMore = !this.seeMore;
    },
  },
});
</script>

<style scoped lang="scss">
body {
  background: #fafafa;
}
.maxWidth {
  max-width: 650px;
}
.full-size {
  width: 100%;
}
.card {
  padding: 1.8rem;
  box-shadow: 3px -3px 20px 0px rgba(0, 0, 0, 0.05),
    0px 10px 15px -3px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border: 1px solid #e6e6e6;
}
.cardText {
  > div {
    margin-bottom: 2rem;
    > * {
      margin-bottom: 1rem;
    }
  }
}
.pointer {
  cursor: pointer;
}
.contentText {
  padding: auto;
  margin: auto;
  width: 95%;
}
.checkboxSelect {
  background: rgba(189, 189, 189, 0.02);
  border-radius: 0.5rem;
  padding: 0.3rem 0.2rem;
  margin-bottom: 0.4rem !important;
  &:hover {
    background: rgba(189 189 189 / 15%);
  }
  .label {
    color: #1a1a1a;
    font-size: 14px;
    line-height: 20px;
  }
  .content {
    color: #666;
    font-size: 14px;
    line-height: 20px;
  }
}

.btn {
  border-radius: 0.3rem;
  background: #1a56ff;
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
    color: #fafafa !important;
  }
}
.seeMore {
  background: #e6e6e642;
  border: 1px solid #e6e6e642;
  border-radius: 20px;
  padding: 0.5rem;
  margin: 0;
}
.prompt {
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
  background: #fcfbfc;
}
</style>
