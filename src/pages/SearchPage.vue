<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { MapPin, ArrowRightLeft, Calendar } from 'lucide-vue-next'
import { useSearchStore } from '../stores/searchStore'

const router = useRouter()
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

function swapOriginDestination() {
  const oIn = searchStore.originInput
  const dIn = searchStore.destinationInput
  const oSel = searchStore.selectedOrigin
  const dSel = searchStore.selectedDestination
  searchStore.$patch({
    originInput: dIn,
    destinationInput: oIn,
    selectedOrigin: dSel,
    selectedDestination: oSel,
  })
  originOpen.value = false
  destinationOpen.value = false
}

function onSubmit() {
  const payload = searchStore.search()
  if (payload) {
    router.push({
      path: '/trips',
      query: {
        from: payload.from,
        to: payload.to,
        date: payload.travelDate,
      },
    })
  }
}

onMounted(() => {
  searchStore.fetchStops()
})
</script>

<template>
  <div class="hero">
    <div class="hero__background" />

    <div class="hero__content">
      <div class="search-card">
        <h2 class="search-card__title">Comprar Passagens de Ônibus</h2>

        <p v-if="loadError" class="search-card__alert" role="alert">
          {{ loadError }}
        </p>

        <p v-else-if="loadingStops" class="search-card__hint">
          Carregando cidades…
        </p>

        <form class="search-form" @submit.prevent="onSubmit">
          <!-- ORIGEM -->
          <div class="input-block">
            <span class="input-block__label">Partindo de</span>

            <div class="input-inner">
              <MapPin class="input-inner__icon" :size="20" :stroke-width="2" aria-hidden="true" />

              <div
                class="autocomplete input-inner__field"
                @focusin="originOpen = true"
                @focusout="scheduleCloseOrigin"
              >
                <input
                  :value="searchStore.originInput"
                  type="text"
                  placeholder="Cidade ou terminal"
                  autocomplete="off"
                  aria-autocomplete="list"
                  :aria-expanded="originOpen && searchStore.filteredOrigins.length > 0"
                  aria-controls="origin-list"
                  @input="searchStore.setOrigin($event.target.value)"
                />

                <ul
                  v-show="originOpen && searchStore.filteredOrigins.length"
                  id="origin-list"
                  class="autocomplete__list"
                  role="listbox"
                >
                  <li
                    v-for="stop in searchStore.filteredOrigins"
                    :key="stop.id"
                    role="option"
                    @mousedown.prevent="
                      searchStore.selectOrigin(stop);
                      originOpen = false;
                    "
                  >
                    <div v-if="stop.type === 'city'" class="option--city">
                      {{ stop.name }}
                    </div>
                    <div v-else class="option--station">
                      ↳ {{ stop.name }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- DESTINO -->
          <div class="input-block">
            <span class="input-block__label">Indo para</span>

            <div class="input-inner">
              <MapPin class="input-inner__icon" :size="20" :stroke-width="2" aria-hidden="true" />

              <div
                class="autocomplete input-inner__field"
                @focusin="destinationOpen = true"
                @focusout="scheduleCloseDestination"
              >
                <input
                  :value="searchStore.destinationInput"
                  type="text"
                  placeholder="Cidade ou terminal"
                  autocomplete="off"
                  aria-autocomplete="list"
                  :aria-expanded="
                    destinationOpen && searchStore.filteredDestinations.length > 0
                  "
                  aria-controls="destination-list"
                  @input="searchStore.setDestination($event.target.value)"
                />

                <ul
                  v-show="destinationOpen && searchStore.filteredDestinations.length"
                  id="destination-list"
                  class="autocomplete__list"
                  role="listbox"
                >
                  <li
                    v-for="stop in searchStore.filteredDestinations"
                    :key="stop.id"
                    role="option"
                    @mousedown.prevent="
                      searchStore.selectDestination(stop);
                      destinationOpen = false;
                    "
                  >
                    <div v-if="stop.type === 'city'" class="option--city">
                      {{ stop.name }}
                    </div>
                    <div v-else class="option--station">
                      ↳ {{ stop.name }}
                    </div>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                class="switch-button"
                aria-label="Trocar origem e destino"
                @click="swapOriginDestination"
              >
                <ArrowRightLeft :size="20" :stroke-width="2" />
              </button>
            </div>
          </div>

          <!-- DATAS -->
          <div class="input-row">
            <div class="input-block">
              <span class="input-block__label">Data saída</span>

              <div class="input-inner">
                <Calendar class="input-inner__icon" :size="20" :stroke-width="2" aria-hidden="true" />
                <input
                  id="travel-date"
                  v-model="travelDate"
                  type="date"
                  class="input-inner__control"
                  :min="searchStore.minTravelDate"
                />
              </div>
            </div>

            <div class="input-block input-block--disabled">
              <span class="input-block__label">Data retorno</span>

              <div class="input-inner">
                <Calendar class="input-inner__icon" :size="20" :stroke-width="2" aria-hidden="true" />
                <input type="date" disabled class="input-inner__control" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="search-button"
            :disabled="!searchStore.canSearch"
          >
            BUSCAR PASSAGEM
          </button>
        </form>
      </div>

      <div class="hero__side">
        <h1>VAI DE ÔNIBUS</h1>
        <p>Vai de Quero Passagem</p>
      </div>
    </div>
  </div>
</template>
