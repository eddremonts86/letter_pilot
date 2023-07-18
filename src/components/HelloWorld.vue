<template>
  <v-container :fluid="seeMore">
    <v-responsive>
      <v-row class="d-flex  pa-5" :class="{seeMore, 'justify-center align-center' : !seeMore}">
        <v-col cols="12" :md="seeMore ? 4 : 6" class="align-stretch d-flex align-center justify-center">
            <v-card class="card maxWidth" rounded>
                <v-card-title>
                  <h2>Letter pilot by Resights</h2>
                </v-card-title>
                <v-card-text class="cardText">
                  <div>
                    <p>
                      Letterpilot is your writing assistant for generating content for new letters on Resights.
                      Upload an existing template and choose the modifications that you would like and receive 3 new versions of the existing template.
                    </p>
                    <p>
                      The new template will be unique to you and you are welcome to use the text in a new template.
                    </p>
                  </div>
                  <div>
                    <h2>Settings</h2>
                      <v-textarea
                      label="Existing marketing copy"
                      outlined
                      v-model="existingMarketingCopy"
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
                    <div  v-for="item in variablesList" class="d-flex justify-start align-center checkboxSelect">
                      <div class="mr-3">
                        <v-checkbox
                          hide-details
                          :key="item.value"
                          :value="item.value"
                          v-model="variablesSelected[item.value]"
                        />
                      </div>
                      <div @click="addElement(item.value, variablesSelected)"
                      class="pointer contentText">
                        <p class="label">{{item.label}}</p>
                        <p class="content">{{item.content}}</p>
                      </div>
                  </div>
                </div>
                <div class="prompt">
                  <h3>Prompt</h3>
                  <div>
                    <v-text-field
                      label="Temperature"
                      type="number"
                      min="0"
                      max="1"
                      v-model="temperature"
                      ></v-text-field>
                  </div>
                  <div>
                    <v-textarea
                      label="Prompt"
                      v-model="promptText"
                      ></v-textarea>
                  </div>
                </div>
                <v-divider class="mb-6"/>
                <div v-if="!seeMore">
                  <div class="d-flex justify-center align-center">
                    <h3>Result</h3>
                    <v-spacer/>
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
                  <v-textarea
                    label="Output goes here"
                    solo
                    v-model="output"
                    />
                </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn class="btn" @click="sendVariable()" :loading="loading">
                    <span> Generate letter </span>
                  </v-btn>
                </v-card-actions>
              </v-card>
        </v-col>
        <v-col cols="12" md="8" v-if="seeMore" class="align-stretch">
          <div class="d-flex justify-center align-center pt-7">
            <h1>Output</h1>
            <v-spacer/>
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
          </div>
          <v-divider class="mb-3"/>
          <p v-html="promptText" class="px-5"/>
          <p v-html="output" class="px-5"/>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import prompt from '@/components/prompt.js';

interface selected {
  [key: string]: any;
}
interface prompt {
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
const myPrompt: prompt = {} as prompt;

export default defineComponent({
  name: 'HelloWorld',
  data: () => ({
    toneValue: 'funny',
    variablesSelected: {"full_name":"full_name","city":"city","property_type":"property_type","days_for_sale":"days_for_sale"},
    output: '',
    seeMore: true,
    loading: false,
    tone: [{
        value: 'funny',
        label: 'Funny'
      },
      {
        value: 'professional',
        label: 'Professional'
      },
      {
        value: 'friendly',
        label: 'Friendly'
      },
      {
        value: 'engaging',
        label: 'Engaging'
      },
    ],
    variablesList: [
      {
        value: 'full_name',
        content: 'Inserts the users full name',
        label: 'Full name'
      },
      {
        value: 'city',
        content: 'Inserts “in” or “on” followed by the name of the city from the property address. For example "on Frederiksberg".',
        label: 'City'
      },
      {
        value: 'property_type',
        content: 'Inserts the name of the property type. For example "villa" or "apartment".',
        label: 'Property type'
      },
      {
        value: 'days_for_sale',
        content: 'Inserts the number of days the property has been for sale. For example “62”.',
        label: 'Days for Sale'
      },
    ],
    temperature: 1,
    prompt: {} as prompt,
    existingMarketingCopy: '',
  }),
  mounted() {
    this.prompt = prompt(this.toneValue, this.temperature)
    this.existingMarketingCopy = this.prompt.existingCopyBody || ''
  },
  watch: {
    toneValue: function (val) {
      this.prompt = prompt(val, this.temperature)
    },
    temperature: function (val) {
      this.prompt = prompt(this.toneValue, val)
    }
  },
  computed: {
    promptText() {
      const {
        header,
        propertyTypeText,
        daysForSaleText,
        cityText,
        userFullNameText,
        temperatureText,
        existingCopyHeader,
        avoid,
        incorporateVariablesText
    } = this.prompt

    let content = {
        incorporated: '',
        fullName: '',
        city: '',
        propertyType: '',
        daysForSale: '',
      }

    let Result =  {
      header,
      content: '',
      temperatureText,
      avoid,
      existingCopyHeader ,
      existingCopyBody : this.existingMarketingCopy

    }
    const variablesSelected = Object.keys(this.variablesSelected)
    if(variablesSelected.length){
      content.incorporated = incorporateVariablesText || ''
    }
    if('full_name' in this.variablesSelected){
      content.fullName = userFullNameText || ''
    }
    if('city' in this.variablesSelected){
      content.city = cityText || ''
    }
    if('property_type' in this.variablesSelected){
      content.propertyType = propertyTypeText || ''
    }
    if('days_for_sale' in this.variablesSelected){
      content.daysForSale = daysForSaleText || ''
    }
    Result.content = Object.values(content).join(' ')
    return Object.values(Result).join(' ')
    }
  },

  methods: {
    addElement(variable : string, variablesSelected: selected){
      if(variablesSelected[variable]) {
        delete variablesSelected[variable]
      } else {
        variablesSelected[variable] = variable
      }
    },
    sendVariable(){
      this.loading = true
      const variablesSelected = Object.keys(this.variablesSelected)
      const payload = {
        tone: this.toneValue,
        existingMarketingCopy: this.existingMarketingCopy,
        variables: variablesSelected
      }
      this.output =
      "<main><h1>Basic HTML Animals</h1><p>This is the first paragraph in our page. It introduces our animals.</p><h2>The Llama</h2><p>Our Llama is a big fan of list items. When she spies a patch of them on a web page, she will eat them like sweets, licking her lips as she goes.</p><h2>The Anaconda</h2><p>The crafty anaconda likes to slither around the page, travelling rapidlyby way of anchors to sneak up on his prey.</p></main>"
      this.loading = false
    },
    openSeeMorePanel(){
      this.seeMore = !this.seeMore
    }
  }
})
</script>

<style scoped lang="scss">
body{
  background: #FAFAFA;
}
  .maxWidth {
    max-width: 650px;
  }
  .card{
    padding:  1.8rem;
    box-shadow: 3px -3px 20px 0px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    border: 1px solid #E6E6E6
  }
  .cardText{
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
  .checkboxSelect{
    background: rgba(189, 189, 189, 0.02);
    border-radius: 0.5rem;
    padding: .3rem .2rem;
    margin-bottom: .4rem !important;
    &:hover{
      background: rgba(189 189 189 / 15%);
    }
    .label{
      color: #1A1A1A;
      font-size: 14px;
      font-family: Inter;
      line-height: 20px;
    }
    .content{
      color: #666;
      font-size: 14px;
      font-family: Inter;
      line-height: 20px;
    }
  }

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
      color: #FAFAFA;
      }
  }
  .seeMore{
    background: #e6e6e642;
    border-radius: 10px;
    border: 1px solid #e6e6e642;
    border-radius: 20px;
    padding: .5rem;
    margin: 0;
  }
  .prompt{
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    border-radius: 6px;
    border: 1px solid #E6E6E6;
    background: #FCFBFC;
  }
</style>