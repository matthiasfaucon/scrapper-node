<template>
  <div :class="containerStyles">
    <div :class="contentStyles">
      <div :class="stepStyles">
        <div :class="questionStyles">
          <h1 v-if="step === 1" for="transactionId" :class="titleStyles">Que voulez-vous faire ?</h1>
          <h1 v-if="step === 2" for="city" :class="titleStyles">Quelle localisation ?</h1>
          <h1 v-if="step === 3" for="minBudget" :class="titleStyles">Quel est votre budget ?</h1>
          <h1 v-if="step === 4" for="minRooms" :class="titleStyles">Combien de pièces minimum ?</h1>
          <h1 v-if="step === 5" for="minArea" :class="titleStyles">Quelle surface minimum ?</h1>
          <hr :class="hrStyles">
        </div>
        <div :class="css({
          width: '90%',
          display: 'flex',
          justifyContent: 'center',
        })">
          <!-- <input v-if="step === " type="text" id="city" v-model="city"> -->
          <div v-if="step === 1" :class="radioGroupStyles">
            <input type="radio" id="rentId" value="rent" v-model="type" style="display: none;">
            <label for="rentId" :class="radioLabelStyles('rent')">Louer</label>
            <input type="radio" id="saleId" value="sale" v-model="type" style="display: none;">
            <label for="saleId" :class="radioLabelStyles('sale')">Acheter</label>
          </div>
          <div :class="css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            width: '80%',
          })" v-else>
            <div :class="css({
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            })" v-if="step === 2">
              <label v-if="step === 2" for="city" :class="labelStyles">Ville</label>
              <input v-if="step === 2" type="text" id="city" v-model="city" :class="inputStyles">
            </div>
            <div v-if="step === 3">
              <label v-if="step === 3" for="minBudget" :class="labelStyles">Budget minimum :</label>
              <input v-if="step === 3" type="number" id="minBudget" v-model="budget.min" :class="inputStyles">
            </div>
            <div v-if="step === 3">
              <label v-if="step === 3" for="maxBudget" :class="labelStyles">Budget maximum :</label>
              <input v-if="step === 3" type="number" id="maxBudget" v-model="budget.max" :class="inputStyles">
            </div>
            <div v-if="step === 4">
              <label v-if="step === 4" for="minRooms" :class="labelStyles">Nombre minimum de pièces :</label>
              <input v-if="step === 4" type="number" id="minRooms" v-model="rooms.min" :class="inputStyles">
            </div>
            <div v-if="step === 4">
              <label v-if="step === 4" for="maxRooms" :class="labelStyles">Nombre maximum de pièces :</label>
              <input v-if="step === 4" type="number" id="maxRooms" v-model="rooms.max" :class="inputStyles">
            </div>
            <div v-if="step === 5">
              <label v-if="step === 5" for="minArea" :class="labelStyles">Superficie minimum (en m²) :</label>
              <input v-if="step === 5" type="number" id="minArea" v-model="area.min" :class="inputStyles">
            </div>
            <div v-if="step === 5">
              <label v-if="step === 5" for="maxArea" :class="labelStyles">Superficie maximum (en m²) :</label>
              <input v-if="step === 5" type="number" id="maxArea" v-model="area.max" :class="inputStyles">
            </div>

          </div>
        </div>
        <div :class="css({
          display: 'flex',
          gap: '2rem',
          justifyContent: 'flex-end',
          width: '70%',
          alignItems: 'flex-end'
        })">
          <button v-if="step > 1" @click="previousStep" :class="buttonStyles">Précédent</button>
          <button v-if="step < 5" @click="nextStep" :class="buttonStyles">Suivant</button>
          <button v-else @click="submitForm" :class="buttonStyles">Soumettre</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { css } from "../../styled-system/css";
import { computed, onMounted, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const step = ref(route.query.step ? parseInt(route.query.step) : 1);
const type = ref(route.query.type ?? "rent");
const city = ref(route.query.city ?? "Rouen");

const budget = reactive({
  min: route.query.budget?.min ? parseInt(route.query.minBudget) : 0,
  max: route.query.budget?.max ? parseInt(route.query.maxBudget) : 1000
});

const rooms = reactive({
  min: route.query.rooms?.min ? parseInt(route.query.minRooms) : 0,
  max: route.query.rooms?.max ? parseInt(route.query.maxRooms) : 5
});

const area = reactive({
  min: route.query.area?.min ? parseInt(route.query.minArea) : 0,
  max: route.query.area?.max ? parseInt(route.query.maxArea) : 100
});

const params = computed(() => {
  return {
    step: step.value, type: type.value,
    city: city.value,
    minBudget: budget.min,
    maxBudget: budget.max,
    minRooms: rooms.min,
    maxRooms: rooms.max,
    minArea: area.min,
    maxArea: area.max
  }
})


function nextStep() {
  step.value++
  console.log(params.value)
  router.push({ query: { ...params.value } })
}

function previousStep() {
  step.value--
  router.push({ query: { ...params.value } })
}

async function submitForm(e) {
  // Traitement du formulaire ici
  e.preventDefault()

  router.push({ query: { ...params.value } })
  const body = {
    type: type.value,
    city: city.value,
    budget: budget,
    rooms: rooms,
    area: area
  }
  Swal.fire({
    title: 'Chargement...',
    text: 'Veuillez patienter pendant que nous recherchons les biens qui pourrait vous plaire.',
    icon: 'info',
    showConfirmButton: false,
    allowOutsideClick: false
  })

  let response = await fetch('http://localhost:3000/api/scraping', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const responseBody = await response.json()
  console.log("Response:", response)
  if (response.status !== 400) {
    Swal.close()
    Swal.fire({
      title: 'Succès',
      text: 'Les biens qui pourraient vous plaire ont été envoyé par mail.',
      icon: 'success'
    })
  } else {
    Swal.close()
    Swal.fire({
      title: 'Erreur',
      text: responseBody.error ?? 'An error occurred while processing the data.',
      icon: 'error'
    })
  }
}

const containerStyles = css({
  display: 'flex',
  width: '100%',
  height: '90dvh',
  justifyContent: 'center',
  alignItems: 'center',
});

const contentStyles = css({
  display: 'flex',
  // border: '0.2rem solid #051014',
  borderRadius: '0.3rem',
  width: '80%',
  height: '80%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4rem',
});

const stepStyles = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const titleStyles = css({
  color: '#051014',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
});

const labelStyles = css({
  color: '#051014',
  fontSize: '1rem',
  fontWeight: 'semibold',
  textTransform: 'uppercase',
});

const questionStyles = css({
  alignSelf: 'flex-start',
  display: 'flex',
  flexDirection: 'column',
  width: '50%',
});

const hrStyles = css({
  width: '100%',
  height: '0.2rem',
  borderRadius: '0.3rem',
  backgroundColor: '#051014',
  margin: '1rem 0',
});

// style for type="text"
const inputStyles = css({
  minWidth: '80%',
  minHeight: '5rem',
  padding: '0.5rem',
  borderRadius: '0.3rem',
  border: '0.1rem solid #051014',
  fontSize: '1.2rem',
  _focus: {
    outline: 'none',
    border: '0.1rem solid #051014',
  }
});

const radioGroupStyles = css({
  display: 'flex',
  justifyContent: step.value === 1 ? 'space-between' : 'center',
  width: '80%',
  alignItems: 'space-between',
});

const radioLabelStyles = (radioType) => css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: type.value === radioType ? '#F9F4F5' : '#051014',
  fontSize: '1.2rem',
  textTransform: 'uppercase',
  fontWeight: 'semibold',
  textAlign: 'center',
  minWidth: '15rem',
  minHeight: '5rem',
  borderRadius: '0.3rem',
  border: '0.1rem solid #051014',
  backgroundColor: type.value === radioType ? '#051001' : '',
  _hover: {
    backgroundColor: type.value === radioType ? '#051001' : '#051014',
    cursor: 'pointer',
    color: '#F9F4F5',
    transition: '0.15s ease-in-out'
  }
});

const buttonStyles = css({
  width: 'fit-content',
  padding: '1rem 3rem',
  border: '0.1rem solid #051014',
  color: '#121212',
  borderRadius: '5rem',
  alignSelf: 'flex-end',
  textTransform: 'uppercase',
  fontWeight: 'semibold',
  _hover: {
    backgroundColor: '#051014',
    cursor: 'pointer',
    color: '#F9F4F5',
    transition: '0.15s ease-in-out'
  },
  _focus: {
    outline: 'none',
    backgroundColor: '#051014',
    color: '#F9F4F5'
  }
});
</script>
