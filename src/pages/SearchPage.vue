<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { MapPin, ArrowRightLeft, Calendar } from 'lucide-vue-next'
import { useSearchStore } from '../stores/searchStore'

const emit = defineEmits(['search'])

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
    emit('search', payload)
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
                    {{ stop.name }}
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
                    {{ stop.name }}
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

<style scoped>
.input-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 32px;
}

.input-inner__icon {
  flex-shrink: 0;
  color: #64748b;
}

.input-inner__field {
  flex: 1;
  min-width: 0;
}

.input-inner__control {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.switch-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  margin: -6px -4px -6px 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #2f66b3;
  cursor: pointer;
  transition: background 0.15s ease;
}

.switch-button:hover {
  background: rgba(47, 102, 179, 0.15);
}

.switch-button:focus-visible {
  outline: 2px solid #2f66b3;
  outline-offset: 2px;
}
</style>
