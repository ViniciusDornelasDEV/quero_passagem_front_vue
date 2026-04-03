<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/searchStore.js'

const emit = defineEmits(['search'])

const searchStore = useSearchStore()
const { loadError, loadingStops, travelDate } = storeToRefs(searchStore)

const originOpen = ref(false)
const destinationOpen = ref(false)

let originBlurTimer
let destBlurTimer

function scheduleCloseOrigin() {
  clearTimeout(originBlurTimer)
  originBlurTimer = setTimeout(() => {
    originOpen.value = false
  }, 150)
}

function scheduleCloseDestination() {
  clearTimeout(destBlurTimer)
  destBlurTimer = setTimeout(() => {
    destinationOpen.value = false
  }, 150)
}

function onSubmit() {
  const payload = searchStore.search()
  if (payload) {
    emit('search', payload)
  }
}

onMounted(() => {
  searchStore.fetchStops()
})
</script>

<template>
  <div class="hero">
    <!-- Fundo -->
    <div class="hero__background" />

    <div class="hero__content">
      <!-- CARD -->
      <div class="search-card">
        <h2 class="search-card__title">
          Comprar Passagens de Ônibus
        </h2>

        <p v-if="loadError" class="search-card__alert">
          {{ loadError }}
        </p>

        <p v-else-if="loadingStops" class="search-card__hint">
          Carregando cidades…
        </p>

        <form class="search-form" @submit.prevent="onSubmit">

          <!-- ORIGEM -->
          <div class="input-block">
            <span class="input-block__label">Partindo de</span>

            <div
              class="autocomplete"
              @focusin="originOpen = true"
              @focusout="scheduleCloseOrigin"
            >
              <input
                :value="searchStore.originInput"
                type="text"
                placeholder="Cidade ou terminal"
                autocomplete="off"
                @input="searchStore.setOrigin($event.target.value)"
              />

              <ul
                v-show="originOpen && searchStore.filteredOrigins.length"
                class="autocomplete__list"
              >
                <li
                  v-for="stop in searchStore.filteredOrigins"
                  :key="stop.id"
                  @mousedown.prevent="
                    searchStore.selectOrigin(stop);
                    originOpen = false;
                  "
                >
                  {{ stop.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- DESTINO -->
          <div class="input-block">
            <span class="input-block__label">Indo para</span>

            <div
              class="autocomplete"
              @focusin="destinationOpen = true"
              @focusout="scheduleCloseDestination"
            >
              <input
                :value="searchStore.destinationInput"
                type="text"
                placeholder="Cidade ou terminal"
                autocomplete="off"
                @input="searchStore.setDestination($event.target.value)"
              />

              <ul
                v-show="destinationOpen && searchStore.filteredDestinations.length"
                class="autocomplete__list"
              >
                <li
                  v-for="stop in searchStore.filteredDestinations"
                  :key="stop.id"
                  @mousedown.prevent="
                    searchStore.selectDestination(stop);
                    destinationOpen = false;
                  "
                >
                  {{ stop.name }}
                </li>
              </ul>
            </div>
          </div>

          <!-- DATAS -->
          <div class="input-row">
            <div class="input-block">
              <span class="input-block__label">Data saída</span>
              <input
                v-model="travelDate"
                type="date"
                :min="searchStore.minTravelDate"
              />
            </div>

            <div class="input-block input-block--disabled">
              <span class="input-block__label">Data retorno</span>
              <input type="date" disabled />
            </div>
          </div>

          <!-- BOTÃO -->
          <button
            type="submit"
            class="search-button"
            :disabled="!searchStore.canSearch"
          >
            BUSCAR PASSAGEM
          </button>
        </form>
      </div>

      <!-- TEXTO LATERAL -->
      <div class="hero__side">
        <h1>VAI DE ÔNIBUS</h1>
        <p>Vai de Quero Passagem</p>
      </div>
    </div>
  </div>
</template>
